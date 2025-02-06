"use client";

import { db } from "@/utils/db";
import { MOCKInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useState, useEffect, useCallback } from "react";
import QuestionSection from "./_components/QuestionSection";
import RecordAnswer from "./_components/RecordAnswer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type InterviewQuestion = {
  Question: string;
  Answer: string;
};

type Props = {
  params: Promise<{ interviewId: string }>;
};

const StartInterview = ({ params }: Props) => {
  const { interviewId } = React.use(params);

  const [interviewData, setInterviewData] = useState<any>(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState<
    InterviewQuestion[]
  >([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInterviewData = useCallback(async () => {
    if (!interviewId) {
      setError("No interview ID provided");
      setIsLoading(false);
      return;
    }

    try {
      const result = await db
        .select()
        .from(MOCKInterview)
        .where(eq(MOCKInterview.mockId, interviewId));

      console.log("Database query result:", result);

      if (result.length > 0) {
        const interviewData = result[0];
        console.log("Raw interview data:", interviewData);

        let jsonMockResponse;
        try {
          jsonMockResponse = JSON.parse(interviewData.jsonMockResp);
          console.log("Parsed jsonMockResponse:", jsonMockResponse);
        } catch (parseError) {
          console.error("Error parsing jsonMockResp:", parseError);
          setError("Error parsing interview data");
          setIsLoading(false);
          return;
        }

        if (Array.isArray(jsonMockResponse) && jsonMockResponse.length > 0) {
          setInterviewData(interviewData);
          setMockInterviewQuestions(jsonMockResponse);
          console.log("Setting mockInterviewQuestions:", jsonMockResponse);
        } else {
          console.error("Invalid jsonMockResponse:", jsonMockResponse);
          setError("No valid questions found in the interview data");
        }
      } else {
        console.error("No interview data found for ID:", interviewId);
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

  useEffect(() => {
    console.log("mockInterviewQuestions updated:", mockInterviewQuestions);
  }, [mockInterviewQuestions]);

  const handlePreviousQuestion = useCallback(() => {
    setActiveQuestionIndex((prevIndex) => Math.max(0, prevIndex - 1));
  }, []);

  const handleNextQuestion = useCallback(() => {
    setActiveQuestionIndex((prevIndex) =>
      prevIndex < mockInterviewQuestions.length - 1 ? prevIndex + 1 : prevIndex
    );
  }, [mockInterviewQuestions.length]);

  if (isLoading) {
    return <div className="text-center p-8">Loading interview data...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (!interviewData || mockInterviewQuestions.length === 0) {
    return <div className="text-center p-8">No interview data available.</div>;
  }

  console.log("Rendering with:", {
    activeQuestionIndex,
    mockInterviewQuestions,
  });

  const isLastQuestion =
    activeQuestionIndex === mockInterviewQuestions.length - 1;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Mock Interview</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden flex">
        <div className="w-1/2 border-r">
          <QuestionSection
            activeQuestionIndex={activeQuestionIndex}
            mockInterviewQuestions={mockInterviewQuestions}
          />
        </div>
        <div className="w-1/2">
          <RecordAnswer
            activeQuestionIndex={activeQuestionIndex}
            mockInterviewQuestions={mockInterviewQuestions}
            interviewData={interviewData}
          />
        </div>
      </div>
      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={handlePreviousQuestion}
          disabled={activeQuestionIndex === 0}
          variant="outline"
          className="px-6 py-2"
        >
          Previous Question
        </Button>

        {isLastQuestion ? (
          <Link href={`/dashboard/interview/${interviewData.mockId}/feedback`}>
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
  );
};

export default StartInterview;
