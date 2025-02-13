"use client";

import { db } from "@/utils/db";
import { CodingInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Code,
  CalendarDays,
  Clock,
  Loader2,
  PlayCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type CodingInterviewData = {
  id: number;
  jsonCodeResp: string;
  interviewId: string;
  interviewTopic: string;
  difficultyLevel: string;
  problemDescription: string;
  timeLimit: string;
  programmingLanguage: string;
  createdBy: string;
  createdAt: Date;
};

const CodingInterviewList = () => {
  const { user, isLoaded } = useUser();
  const [interviewList, setInterviewList] = useState<CodingInterviewData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getCodingInterviewList = async () => {
      if (!isLoaded || !user?.primaryEmailAddress?.emailAddress) return;

      try {
        setIsLoading(true);
        const result = await db
          .select()
          .from(CodingInterview)
          .where(
            eq(CodingInterview.createdBy, user.primaryEmailAddress.emailAddress)
          )
          .orderBy(desc(CodingInterview.id));

        setInterviewList(result);
      } catch (err) {
        setError(
          "Failed to fetch coding interview list. Please try again later."
        );
        console.error("Error fetching coding interviews:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getCodingInterviewList();
  }, [user, isLoaded]);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const handleStartInterview = (interviewId: string) => {
    router.push(`/dashboard/codingInterview/${interviewId}`);
  };

  const handleViewSolution = (interviewId: string) => {
    router.push(`/dashboard/codingInterview/${interviewId}/coding-feedback`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "hard":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block p-4 rounded-lg bg-red-50 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : interviewList.length === 0 ? (
        <div className="text-center p-8">
          <div className="inline-block p-4 rounded-lg bg-gray-50 text-gray-600">
            No coding interviews found. Create your first one!
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {interviewList.map((interview) => (
            <Card
              key={interview.id}
              className="hover:shadow-md transition-all duration-200 border border-gray-200 bg-white/50 backdrop-blur-sm flex flex-col"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {interview.interviewTopic}
                  </CardTitle>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(
                      interview.difficultyLevel
                    )}`}
                  >
                    {interview.difficultyLevel}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Code className="h-4 w-4" />
                      <span>{interview.programmingLanguage}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{interview.timeLimit}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      {new Date(interview.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {truncateText(interview.problemDescription, 120)}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-3 border-t border-gray-100">
                <div className="flex gap-3 w-full">
                  <Button
                    onClick={() => handleStartInterview(interview.interviewId)}
                    className="h-10 flex-1 bg-black text-white font-medium"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Start
                  </Button>
                  <Button
                    onClick={() => handleViewSolution(interview.interviewId)}
                    className="h-10 flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    Sol
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodingInterviewList;
