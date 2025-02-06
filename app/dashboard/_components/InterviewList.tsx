"use client";

import { db } from "@/utils/db";
import { MOCKInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Briefcase, CalendarDays, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type InterviewData = {
  id: number;
  jsonMockResp: string;
  jobPosition: string;
  jobDescription: string;
  jobExperience: string;
  fileData: string | null;
  createdBy: string;
  createdAt: string;
  mockId: string;
};

const InterviewList = () => {
  const { user, isLoaded } = useUser();
  const [interviewList, setInterviewList] = useState<InterviewData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const getInterviewList = async () => {
      if (!isLoaded || !user?.primaryEmailAddress?.emailAddress) return;

      try {
        setIsLoading(true);
        const result = await db
          .select({
            id: MOCKInterview.id,
            jobPosition: MOCKInterview.jobPosition,
            jobDescription: MOCKInterview.jobDescription,
            jobExperience: MOCKInterview.jobExperience,
            createdAt: MOCKInterview.createdAt,
            mockId: MOCKInterview.mockId,
            jsonMockResp: MOCKInterview.jsonMockResp,
            fileData: MOCKInterview.fileData,
            createdBy: MOCKInterview.createdBy,
          })
          .from(MOCKInterview)
          .where(
            eq(MOCKInterview.createdBy, user.primaryEmailAddress.emailAddress)
          )
          .orderBy(desc(MOCKInterview.id));

        setInterviewList(result);
      } catch (err) {
        setError("Failed to fetch interview list. Please try again later.");
        console.error("Error fetching interviews:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getInterviewList();
  }, [user, isLoaded]);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const handleStartInterview = (mockId: string) => {
    // Add your interview start logic here
    router.push(`/dashboard/interview/${mockId}`);
  };

  const handleViewFeedback = (mockId: string) => {
    // Add your feedback view logic here
    router.push(`/dashboard/${mockId}/feedback`);
    router.push(`/dashboard/interview/${mockId}/feedback`);
  };

  if (!isLoaded) return <div className="mt-8 text-center">Loading user...</div>;
  if (error)
    return <div className="mt-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="font-medium text-2xl mb-6">Previous Mock Interviews</h2>

      {isLoading ? (
        <div className="text-center">Loading interviews...</div>
      ) : interviewList.length === 0 ? (
        <div className="text-center text-gray-500">No interviews found</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {interviewList.map((interview) => (
            <Card
              key={interview.id}
              className="hover:shadow-lg transition-shadow flex flex-col"
            >
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  {interview.jobPosition}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="h-4 w-4" />
                    <span>Experience: {interview.jobExperience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">
                      Job Description
                    </div>
                    <p className="text-sm text-gray-500">
                      {truncateText(interview.jobDescription, 150)}
                    </p>
                  </div>
                  {interview.fileData && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>Resume Attached</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 border-t pt-4">
                <Button
                  className="flex-1"
                  onClick={() => handleStartInterview(interview.mockId)}
                >
                  Start
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleViewFeedback(interview.mockId)}
                >
                  Feedback
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewList;
