// RecordAnswer.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import {
  Mic,
  StopCircle,
  Camera,
  CameraOff,
  Trash2,
  CircleCheckBig,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { UserAnswer } from "@/utils/schema";
import { and, eq } from "drizzle-orm";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type InterviewQuestion = {
  Question: string;
  Answer: string;
};

type Props = {
  mockInterviewQuestions: InterviewQuestion[];
  activeQuestionIndex: number;
  interviewData: interviewData;
};

type Feedback = {
  rating: number;
  feedback: string;
};

type interviewData = {
  id: number;
  jsonMockResp: string;
  jobPosition: string;
  jobDescription: string;
  jobExperience: string;
  fileData: string;
  createdBy: string;
  createdAt: string;
  mockId: string;
};

const RecordAnswer = ({
  mockInterviewQuestions,
  activeQuestionIndex,
  interviewData,
}: Props) => {
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] =
    useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [existingAnswer, setExistingAnswer] = useState<any>(null);

  const recognitionRef = useRef<any>(null);
  const webcamRef = useRef<Webcam>(null);
  const { user } = useUser();

  // Fetch existing answer when question changes
  useEffect(() => {
    const fetchExistingAnswer = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      try {
        const existingAnswers = await db
          .select()
          .from(UserAnswer)
          .where(
            and(
              eq(UserAnswer.mockIdRef, interviewData.mockId),
              eq(
                UserAnswer.question,
                mockInterviewQuestions[activeQuestionIndex].Question
              ),
              eq(UserAnswer.userEmail, user.primaryEmailAddress.emailAddress)
            )
          );

        if (existingAnswers.length > 0) {
          const answer = existingAnswers[0];
          setExistingAnswer(answer);
          setTranscript(answer.UserAns);
          setFeedback({
            rating: parseInt(answer.rating),
            feedback: answer.feedback,
          });
        } else {
          setExistingAnswer(null);
          setTranscript("");
          setFeedback(null);
        }
      } catch (error) {
        console.error("Error fetching existing answer:", error);
      }
    };

    fetchExistingAnswer();
  }, [
    activeQuestionIndex,
    user?.primaryEmailAddress?.emailAddress,
    interviewData.mockId,
    mockInterviewQuestions,
  ]);

  useEffect(() => {
    // Check if recorded answer is too short when recording stops
    if (!isRecording && transcript) {
      const words = transcript.trim().split(/\s+/);
      if (words.length < 10) {
        setTranscript("");
        toast({
          title: "Answer too short",
          description:
            "Your answer should be at least 10 words long. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [isRecording, transcript]);

  useEffect(() => {
    // Check for speech recognition support
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      setIsSpeechRecognitionSupported(true);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSpeechRecognitionError = (error: string) => {
    let errorMessage = "An error occurred with speech recognition.";
    switch (error) {
      case "network":
        errorMessage =
          "Network error. Please check your internet connection and try again.";
        break;
      case "not-allowed":
      case "permission-denied":
        errorMessage =
          "Microphone access denied. Please allow microphone access and try again.";
        break;
      case "no-speech":
        errorMessage = "No speech detected. Please try speaking again.";
        break;
      case "audio-capture":
        errorMessage =
          "Audio capture failed. Please check your microphone and try again.";
        break;
      case "aborted":
        errorMessage = "Speech recognition was aborted. Please try again.";
        break;
    }
    toast({
      title: "Speech Recognition Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const saveUserAnswer = async () => {
    if (isRecording) {
      stopRecording();
    }
    if (transcript.trim().length === 0) {
      toast({
        title: "Error",
        description: "Please record an answer before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: mockInterviewQuestions[activeQuestionIndex].Question,
          answer: transcript,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (
        !data.feedback ||
        typeof data.feedback.rating !== "number" ||
        typeof data.feedback.feedback !== "string"
      ) {
        throw new Error("Invalid feedback format received");
      }

      const answerData = {
        mockIdRef: interviewData.mockId,
        question: mockInterviewQuestions[activeQuestionIndex].Question,
        correctAnswer: mockInterviewQuestions[activeQuestionIndex].Answer,
        UserAns: transcript,
        feedback: data.feedback.feedback,
        rating: data.feedback.rating.toString(),
        userEmail: user?.primaryEmailAddress?.emailAddress || "",
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      };

      if (existingAnswer) {
        // Update existing answer
        await db
          .update(UserAnswer)
          .set(answerData)
          .where(
            and(
              eq(UserAnswer.mockIdRef, interviewData.mockId),
              eq(
                UserAnswer.question,
                mockInterviewQuestions[activeQuestionIndex].Question
              ),
              eq(
                UserAnswer.userEmail,
                user?.primaryEmailAddress?.emailAddress || ""
              )
            )
          );
      } else {
        // Create new answer
        await db.insert(UserAnswer).values(answerData);
      }

      setFeedback(data.feedback);
      toast({
        title: existingAnswer ? "Answer Updated" : "Answer Saved",
        description: existingAnswer
          ? "Your answer has been updated and feedback regenerated."
          : "Your answer has been saved and feedback generated.",
      });
    } catch (error) {
      console.error("Error saving answer:", error);
      toast({
        title: "Error",
        description:
          "Failed to save answer and generate feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAnswer = () => {
    if (transcript.trim()) {
      setTranscript("");
      setFeedback(null);
      toast({
        title: "Answer Cleared",
        description: "Your recorded answer has been cleared.",
      });
    }
  };

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Error",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    setIsRecording(true);
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(" ");
      setTranscript(currentTranscript.trim());
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      handleSpeechRecognitionError(event.error);
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      toast({
        title: "Error",
        description: "Failed to start speech recognition. Please try again.",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const toggleWebcam = () => {
    setIsWebcamEnabled((prev) => !prev);
  };

  if (!isSpeechRecognitionSupported) {
    return (
      <div className="p-4 text-red-500 bg-red-100 rounded-lg">
        Speech recognition is not supported in this browser. Please try using a
        modern browser like Chrome or Edge.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between h-full p-4">
      <div className="w-full mb-2 relative">
        {isWebcamEnabled ? (
          <Webcam
            ref={webcamRef}
            mirrored={true}
            className="w-full h-[300px] object-cover rounded-lg shadow-md"
          />
        ) : (
          <div className="w-full h-[300px] bg-gray-100 rounded-lg shadow-md flex items-center justify-center">
            <Camera size={64} className="text-gray-400" />
          </div>
        )}
        <Button
          variant="outline"
          className="absolute top-2 right-2"
          onClick={toggleWebcam}
        >
          {isWebcamEnabled ? (
            <>
              <CameraOff size={20} className="mr-2" /> Disable Camera
            </>
          ) : (
            <>
              <Camera size={20} className="mr-2" /> Enable Camera
            </>
          )}
        </Button>
      </div>

      <div className="w-full space-y-2">
        <Button
          variant={isRecording ? "destructive" : "default"}
          className="w-full h-10 text-base"
          onClick={toggleRecording}
          disabled={isLoading}
        >
          {isRecording ? (
            <>
              <StopCircle size={20} className="mr-2" /> Stop Recording
            </>
          ) : (
            <>
              <Mic size={20} className="mr-2" /> Start Recording
            </>
          )}
        </Button>

        {(isRecording || transcript) && (
          <div className="w-full rounded-md border p-3 bg-white">
            <div className="flex-1 flex w-full justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {isRecording ? "Recording" : "Recorded"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isRecording ? "Start speaking..." : "Thanks for talking."}
                </p>
              </div>
              {isRecording && (
                <div className="rounded-full w-3 h-3 bg-red-400 animate-pulse" />
              )}
            </div>
            {transcript && (
              <div className="border rounded-md p-2 h-full mt-4">
                <p className="mb-0">{transcript}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 w-full">
          <Button
            variant="outline"
            className="flex-1"
            onClick={saveUserAnswer}
            disabled={isLoading || !transcript.trim()}
          >
            <CircleCheckBig size={20} className="mr-2" />
            {isLoading
              ? "Generating Feedback..."
              : existingAnswer
              ? "Update Answer"
              : "Save Answer"}
          </Button>

          <Button
            variant="outline"
            className="flex-1"
            onClick={handleClearAnswer}
            disabled={isLoading || !transcript.trim()}
          >
            <Trash2 size={20} className="mr-2" />
            Clear
          </Button>
        </div>

        {feedback && (
          <div className="w-full rounded-md border p-3 bg-white mt-4">
            <h3 className="text-lg font-semibold mb-2">Feedback</h3>
            <p>
              <strong>Rating:</strong> {feedback.rating}/10
            </p>
            <p>
              <strong>Feedback:</strong> {feedback.feedback}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordAnswer;
