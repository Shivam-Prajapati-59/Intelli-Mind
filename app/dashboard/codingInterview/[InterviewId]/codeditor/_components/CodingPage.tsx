"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, FileCode, Settings2, Undo2, Redo2, Camera } from "lucide-react";
import { undo, redo } from "@codemirror/commands";
import type { EditorView } from "@codemirror/view";
import { db } from "@/utils/db";
import { CodingInterview, UserCodeAnswer } from "@/utils/schema";
import { and, eq } from "drizzle-orm";
import { formatCode } from "@/lib/formatter";
import CodeEditor from "./CodeEditor";
import CodingQuestion from "./CodingQuestion";
import FloatingWebcam from "./FloatingWebacm";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import InterviewTimer from "./InterviewTimer";

type CodingInterviewQuestion = {
  title: string;
  description: string;
  examples: Array<{
    input: string[];
    output: number;
    explanation: string;
  }>;
  difficulty: "Easy" | "Medium" | "Hard";
  constraints: string[];
  hints?: string[];
};

interface FeedbackResponse {
  rating: number;
  technicalAccuracy: number;
  codeQuality: number;
  feedback: {
    strengths: string[];
    improvements: string[];
    complexityAnalysis: string;
    bestPractices: string;
  };
}
interface Props {
  params: {
    InterviewId: string;
  };
}

export default function CodingInterviewPage({ params }: Props) {
  const interviewId = params.InterviewId;

  // State management
  const [language, setLanguage] = useState<"java" | "cpp">("java");
  const [code, setCode] = useState(getInitialCode("java"));
  const [output, setOutput] = useState("");
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [interviewData, setInterviewData] = useState<any>(null);
  const [codingInterviewQuestions, setCodingInterviewQuestions] = useState<
    any[]
  >([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 14,
    fontFamily: "monospace",
    lineHeight: 1.5,
  });
  const [transcriptExplanation, setTranscriptExplanation] = useState("");
  const editorViewRef = useRef<EditorView | null>(null);
  const [existingAnswer, setExistingAnswer] = useState<any>(null);
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  const [interviewDuration, setInterviewDuration] = useState<number>(30);

  const { user } = useUser();

  // Fetch existing answer when question changes
  useEffect(() => {
    const fetchExistingAnswer = async () => {
      if (
        !user?.primaryEmailAddress?.emailAddress ||
        !codingInterviewQuestions[activeQuestionIndex]
      ) {
        return;
      }

      try {
        const existingAnswers = await db
          .select()
          .from(UserCodeAnswer)
          .where(
            and(
              eq(UserCodeAnswer.interviewIdRef, interviewId),
              eq(
                UserCodeAnswer.question,
                JSON.stringify(codingInterviewQuestions[activeQuestionIndex])
              ),
              eq(
                UserCodeAnswer.userEmail,
                user.primaryEmailAddress.emailAddress
              )
            )
          );

        if (existingAnswers.length > 0) {
          const answer = existingAnswers[0];
          setExistingAnswer(answer);
          setCode(answer.userAnswer);
          if (answer.feedback) {
            const parsedFeedback = JSON.parse(answer.feedback);
            setFeedback(parsedFeedback);
            setShowFeedback(true);
          }
        } else {
          setExistingAnswer(null);
          setCode(getInitialCode(language));
          setFeedback(null);
          setShowFeedback(false);
        }
      } catch (error) {
        console.error("Error fetching existing answer:", error);
      }
    };

    fetchExistingAnswer();
  }, [
    activeQuestionIndex,
    user?.primaryEmailAddress?.emailAddress,
    interviewId,
    codingInterviewQuestions,
    language,
  ]);

  // Fetch interview data
  const fetchInterviewData = useCallback(async () => {
    console.log("Fetching interview data for interview ID:", interviewId);

    if (!interviewId) {
      setError("No interview ID provided");
      setIsLoading(false);
      return;
    }

    try {
      const result = await db
        .select()
        .from(CodingInterview)
        .where(eq(CodingInterview.interviewId, interviewId));

      if (result.length > 0) {
        const interviewData = result[0];
        try {
          const jsonCodingQuestions = JSON.parse(interviewData.jsonCodeResp);

          if (
            Array.isArray(jsonCodingQuestions) &&
            jsonCodingQuestions.length > 0
          ) {
            setInterviewData(interviewData);
            setCodingInterviewQuestions(jsonCodingQuestions);

            const timeLimitMatch = interviewData.timeLimit.match(/(\d+)/);
            if (timeLimitMatch) {
              const minutes = Number.parseInt(timeLimitMatch[1], 10);
              setInterviewDuration(minutes); // Convert minutes to seconds
            } else {
              console.error("Invalid time limit format");
              setError("Invalid time limit format");
            }
          } else {
            setError("No valid questions found in the interview data");
          }
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          setError("Error parsing interview questions data");
        }
      } else {
        setError("No interview data found");
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
      setError("Error fetching interview details");
    } finally {
      setIsLoading(false);
    }
  }, [interviewId]);

  useEffect(() => {
    fetchInterviewData();
  }, [fetchInterviewData]);

  // feedback
  const handleGetFeedback = async () => {
    setIsLoadingFeedback(true);
    const currentQuestion = codingInterviewQuestions[activeQuestionIndex];

    try {
      const response = await fetch("/api/coding-questions-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: JSON.stringify({
            title: currentQuestion.title,
            description: currentQuestion.description,
            examples: currentQuestion.examples,
            constraints: currentQuestion.constraints,
          }),
          code,
          explanation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get feedback");
      }

      setFeedback(data.feedback);
      setShowFeedback(true);

      // Prepare data for database
      const feedbackData = {
        interviewIdRef: interviewId,
        question: JSON.stringify(currentQuestion),
        correctAnswer: JSON.stringify(currentQuestion.solution),
        userAnswer: code,
        feedback: JSON.stringify(data.feedback),
        rating: data.feedback.rating.toString(),
        userEmail: user?.primaryEmailAddress?.emailAddress ?? "unknown",
        createdAt: new Date(),
        language: language,
      };

      try {
        if (existingAnswer) {
          // Update existing answer
          await db
            .update(UserCodeAnswer)
            .set(feedbackData)
            .where(
              and(
                eq(UserCodeAnswer.interviewIdRef, interviewId),
                eq(UserCodeAnswer.question, JSON.stringify(currentQuestion)),
                eq(
                  UserCodeAnswer.userEmail,
                  user?.primaryEmailAddress?.emailAddress ?? "unknown"
                )
              )
            );
        } else {
          // Insert new answer
          await db.insert(UserCodeAnswer).values(feedbackData);
        }
        console.log(
          existingAnswer
            ? "Answer updated successfully"
            : "New answer stored successfully"
        );
      } catch (dbError) {
        console.error("Database operation failed:", dbError);
        throw dbError;
      }
    } catch (error) {
      console.error("Error in handleGetFeedback:", error);
      setError(
        error instanceof Error ? error.message : "Failed to get feedback"
      );
    } finally {
      setIsLoadingFeedback(false);
    }
  };
  // Update the submit button text based on existingAnswer
  const getSubmitButtonText = () => {
    if (isLoadingFeedback) return "Submiting.";
    return existingAnswer ? "Update" : "Submit";
  };
  // Event handlers
  const handleCompileAndRun = useCallback(async () => {
    setOutput("Compiling and running...");
    try {
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });
      const data = await response.json();
      setOutput(data.output || "Error: " + data.error);
    } catch (error) {
      console.error("Error compiling and running code:", error);
      setOutput("Error compiling and running code. Please try again.");
    }
  }, [language, code]);

  const handleFormat = useCallback(async () => {
    try {
      const formattedCode = await formatCode(code, language);
      setCode(formattedCode);
    } catch (error) {
      console.error("Error formatting code:", error);
      setOutput("Error formatting code. Please try again.");
    }
  }, [code, language]);

  const handleUndo = useCallback(() => {
    if (editorViewRef.current) undo(editorViewRef.current);
  }, []);

  const handleRedo = useCallback(() => {
    if (editorViewRef.current) redo(editorViewRef.current);
  }, []);

  const handleSettingChange = useCallback(
    (key: string, value: string | number) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handlePreviousQuestion = useCallback(() => {
    setActiveQuestionIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNextQuestion = useCallback(() => {
    setActiveQuestionIndex((prev) =>
      prev < codingInterviewQuestions.length - 1 ? prev + 1 : prev
    );
  }, [codingInterviewQuestions.length]);

  const handleTranscriptChange = useCallback((transcript: string) => {
    setTranscriptExplanation(transcript);
    setExplanation(transcript); // Update the explanation state with the transcript
  }, []);

  const handleInterviewEnd = useCallback(() => {
    setIsInterviewEnded(true);
    setInterviewDuration;
    // You can add any other logic here, such as submitting all answers
  }, []);

  if (isLoading) {
    return <div className="text-center p-8">Loading interview data...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (!interviewData || codingInterviewQuestions.length === 0) {
    return <div className="text-center p-8">No interview data available.</div>;
  }

  const isLastQuestion =
    activeQuestionIndex === codingInterviewQuestions.length - 1;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="w-2/5 p-6 bg-white shadow-lg overflow-y-auto border-r border-gray-200">
        <CodingQuestion
          question={codingInterviewQuestions[activeQuestionIndex]}
        />
      </div>
      <div className="flex-1 flex flex-col h-full">
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
              <Select
                onValueChange={(value: "java" | "cpp") => {
                  setLanguage(value);
                  setCode(getInitialCode(value));
                }}
                defaultValue={language}
              >
                <SelectTrigger className="w-[140px] border-gray-200">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleCompileAndRun}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Run Code
              </Button>
              <Button
                onClick={handleGetFeedback}
                disabled={isLoadingFeedback}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {getSubmitButtonText()}
              </Button>
              <Button
                onClick={handleFormat}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FileCode className="h-4 w-4 mr-2" />
                Format
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={handleUndo} variant="outline" size="icon">
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button onClick={handleRedo} variant="outline" size="icon">
                <Redo2 className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setShowWebcam(!showWebcam)}
                variant="outline"
                size="icon"
              >
                <Camera className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="outline"
                size="icon"
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showSettings && (
            <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="fontSize" className="text-sm text-gray-600">
                  Font Size
                </Label>
                <Input
                  id="fontSize"
                  type="number"
                  value={settings.fontSize.toString()}
                  onChange={(e) =>
                    handleSettingChange(
                      "fontSize",
                      Number.parseInt(e.target.value) || 14
                    )
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="fontFamily" className="text-sm text-gray-600">
                  Font Family
                </Label>
                <Input
                  id="fontFamily"
                  value={settings.fontFamily}
                  onChange={(e) =>
                    handleSettingChange("fontFamily", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lineHeight" className="text-sm text-gray-600">
                  Line Height
                </Label>
                <Input
                  id="lineHeight"
                  type="number"
                  step="0.1"
                  value={settings.lineHeight.toString()}
                  onChange={(e) =>
                    handleSettingChange(
                      "lineHeight",
                      Number.parseFloat(e.target.value) || 1.5
                    )
                  }
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 grid grid-rows-[1fr,auto] overflow-hidden">
          <div className="overflow-hidden border rounded-md m-4 bg-white shadow-sm">
            <CodeEditor
              language={language}
              code={code}
              onChange={setCode}
              editorViewRef={editorViewRef}
              settings={settings}
            />
          </div>

          {output && (
            <div className="h-48 m-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full overflow-y-auto">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  Output
                </h2>
                <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded-md text-sm">
                  {output}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center p-4 bg-white border-t border-gray-200">
          <Button
            onClick={handlePreviousQuestion}
            disabled={activeQuestionIndex === 0}
            variant="outline"
            className="px-6 py-2"
          >
            Previous Question
          </Button>

          {isLastQuestion ? (
            <Link
              href={`/dashboard/codingInterview/${interviewData.interviewId}/coding-feedback`}
            >
              <Button
                variant="default"
                className="px-6 py-2 bg-green-600 hover:bg-green-700"
              >
                End Interview
              </Button>
            </Link>
          ) : (
            <Button
              onClick={handleNextQuestion}
              variant="default"
              className="px-6 py-2"
            >
              Next Question
            </Button>
          )}
        </div>
      </div>

      {showWebcam && (
        <FloatingWebcam
          onClose={() => setShowWebcam(false)}
          onTranscriptChange={handleTranscriptChange}
        />
      )}
      {explanation && (
        <div className="fixed bottom-4 left-4 w-1/3 bg-white rounded-lg shadow-lg p-4 z-50">
          <h3 className="text-lg font-semibold mb-2">Recorded Explanation</h3>
          <p className="text-sm">{explanation}</p>
        </div>
      )}
      {isInterviewEnded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Interview Ended</h2>
            <p>
              The interview time has expired. Your answers have been submitted.
            </p>
            <Link
              href={`/dashboard/codingInterview/${interviewData.interviewId}/coding-feedback`}
            >
              <Button className="mt-4" variant="default">
                View Feedback
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function getInitialCode(language: "java" | "cpp") {
  if (language === "java") {
    return `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;
  } else if (language === "cpp") {
    return `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
`;
  }
  return "";
}
