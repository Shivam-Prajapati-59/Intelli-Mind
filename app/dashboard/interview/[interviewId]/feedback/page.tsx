"use client";

import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, CheckCircle, Award, ThumbsUp, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  params: Promise<{ interviewId: string }>;
};

const Feedback = ({ params }: Props) => {
  const { interviewId } = use(params);
  const [answers, setAnswers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const result = await db
          .select()
          .from(UserAnswer)
          .where(eq(UserAnswer.mockIdRef, interviewId))
          .orderBy(UserAnswer.id);
        setAnswers(result);
      } catch (error) {
        console.error("Error fetching answers:", error);
      }
    };

    fetchAnswers();
  }, [interviewId]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Award className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-green-500 tracking-tight">
            Congratulations!
          </h2>
          <p className="text-lg text-gray-600">
            You have successfully completed the interview.
          </p>
        </div>

        <Card className="bg-white shadow-lg">
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <ThumbsUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                Interview Performance
              </h2>
            </div>
            <div className="bg-primary/10 rounded-lg p-3 md:p-4">
              <h2 className="text-primary text-lg font-medium">
                Overall Rating: <span className="font-bold">Good</span>
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              Review your answers, correct responses, and personalized feedback
              below.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {answers.map((answer, index) => (
            <Collapsible key={answer.id}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full bg-white hover:bg-gray-50 shadow-sm border rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">Question {index + 1}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-4 md:p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {answer.question}
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-red-50 rounded-lg p-3">
                        <span className="font-medium text-gray-700">
                          Your Answer:{" "}
                        </span>
                        <span className="text-red-600">{answer.UserAns}</span>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <span className="font-medium text-gray-700">
                          Correct Answer:{" "}
                        </span>
                        <span className="text-green-600">
                          {answer.correctAnswer}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="font-medium text-gray-700">
                          Rating:{" "}
                        </span>
                        <span className="text-primary">{answer.rating}/10</span>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <span className="font-medium text-gray-700">
                          Feedback:{" "}
                        </span>
                        <p className="mt-1 text-gray-600">{answer.feedback}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Button
            onClick={() => router.push("/dashboard")}
            className="flex items-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Go to Home</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
