"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Clock,
  Code2,
  MessageSquare,
  AlertCircle,
  Trophy,
  Binary,
  Layers,
} from "lucide-react";
import { db } from "@/utils/db";
import { CodingInterview, UserCodeAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

type Interview = {
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

type UserAnswer = {
  id: number;
  interviewIdRef: string;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  feedback: string;
  rating: string;
  userEmail: string;
  createdAt: Date;
  language: string;
};

type Props = {
  params: Promise<{
    InterviewId: string;
  }>;
};

const InterviewFeedbackPage = ({ params }: Props) => {
  // Unwrap the params using React.use()
  const { InterviewId } = React.use(params);

  const [interview, setInterview] = useState<Interview | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch interview details
        const interviewResult = await db
          .select()
          .from(CodingInterview)
          .where(eq(CodingInterview.interviewId, InterviewId));

        if (interviewResult.length === 0) {
          setError("Interview not found");
          return;
        }

        setInterview(interviewResult[0]);

        // Fetch user answers if user is logged in
        if (user?.primaryEmailAddress?.emailAddress) {
          const answersResult = await db
            .select()
            .from(UserCodeAnswer)
            .where(eq(UserCodeAnswer.interviewIdRef, InterviewId));

          setUserAnswers(answersResult);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load interview data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [InterviewId, user?.primaryEmailAddress?.emailAddress]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-destructive">{error}</h2>
        <Link href="/dashboard">
          <Button className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const getScoreColor = (rating: number) => {
    if (rating >= 8) return "text-green-500";
    if (rating >= 6) return "text-yellow-500";
    return "text-destructive";
  };

  const averageScore = userAnswers.length
    ? Math.round(
        userAnswers.reduce(
          (sum, answer) => sum + Number.parseInt(answer.rating),
          0
        ) / userAnswers.length
      )
    : 0;

  const AISolutionTab = ({ answer }: { answer: UserAnswer }) => {
    const [showSolution, setShowSolution] = useState(false);
    const solutions = JSON.parse(answer.correctAnswer); // Ensure correct parsing
    const [selectedLang, setSelectedLang] = useState("cpp");

    return (
      <div className="space-y-4">
        {!showSolution ? (
          <div className="text-center p-6 space-y-4">
            <AlertCircle className="mx-auto h-8 w-8 text-amber-500" />
            <div className="space-y-2">
              <h4 className="font-semibold">View AI Solution</h4>
              <p className="text-muted-foreground">
                Remember: It's important to try solving the problem on your own
                first. The AI solution is here to help you learn and compare
                approaches.
              </p>
            </div>
            <Button onClick={() => setShowSolution(true)} variant="outline">
              Show Solution
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Language Selection Tabs */}
            <Tabs value={selectedLang} onValueChange={setSelectedLang}>
              <TabsList>
                <TabsTrigger value="cpp">C++</TabsTrigger>
                <TabsTrigger value="java">Java</TabsTrigger>
              </TabsList>

              <TabsContent value="cpp">
                <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm">
                    <code className="language-cpp">{solutions.cpp}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="java">
                <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm">
                    <code className="language-java">{solutions.java}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>

            {/* Solution Explanation */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-primary mb-2">
                  Solution Explanation
                </h4>
                <p className="text-muted-foreground whitespace-pre-line">
                  {JSON.parse(answer.question).explanation}
                </p>
              </div>
              <Button
                onClick={() => setShowSolution(false)}
                variant="outline"
                size="sm"
              >
                Hide Solution
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Coding Interview Feedback
            </h1>
            <p className="text-muted-foreground mt-1">
              {interview.interviewTopic} - {interview.difficultyLevel}
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Interview Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Interview Overview</CardTitle>
            <CardDescription>
              Created on {new Date(interview.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p
                    className={`text-2xl font-bold ${getScoreColor(averageScore)}`}
                  >
                    {averageScore}/10
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Time Limit</p>
                  <p className="text-2xl font-bold">{interview.timeLimit}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Code2 className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Language</p>
                  <p className="text-2xl font-bold">
                    {interview.programmingLanguage}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Layers className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Questions Attempted
                  </p>
                  <p className="text-2xl font-bold">{userAnswers.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solutions and Feedback */}
        <div className="space-y-6">
          {userAnswers.map((answer, index) => {
            const parsedQuestion = JSON.parse(answer.question);
            const parsedFeedback = JSON.parse(answer.feedback);
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <Badge
                        className="mb-2"
                        variant={
                          parsedQuestion.difficulty === "Hard"
                            ? "destructive"
                            : parsedQuestion.difficulty === "Medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {parsedQuestion.difficulty}
                      </Badge>
                      <CardTitle>{parsedQuestion.title}</CardTitle>
                    </div>
                    <div
                      className={`text-2xl font-bold ${getScoreColor(Number.parseInt(answer.rating))}`}
                    >
                      {answer.rating}/10
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="solution" className="w-full">
                    <TabsList className="w-full sm:w-auto">
                      <TabsTrigger value="solution">
                        <Binary className="w-4 h-4 mr-2" />
                        Solution
                      </TabsTrigger>
                      <TabsTrigger value="feedback">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Feedback
                      </TabsTrigger>
                      <TabsTrigger value="solutionByAI">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Solution By AI
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="solution" className="mt-4">
                      <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm">
                          <code>{answer.userAnswer}</code>
                        </pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="feedback" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-green-600 mb-2">
                            Strengths
                          </h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {parsedFeedback.feedback.strengths.map(
                              (strength: string, i: number) => (
                                <li key={i} className="text-muted-foreground">
                                  {strength}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-semibold text-amber-600 mb-2">
                            Areas for Improvement
                          </h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {parsedFeedback.feedback.improvements.map(
                              (improvement: string, i: number) => (
                                <li key={i} className="text-muted-foreground">
                                  {improvement}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-semibold text-blue-600 mb-2">
                            Complexity Analysis
                          </h4>
                          <p className="text-muted-foreground">
                            {parsedFeedback.feedback.complexityAnalysis}
                          </p>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-semibold text-purple-600 mb-2">
                            Best Practices
                          </h4>
                          <p className="text-muted-foreground">
                            {parsedFeedback.feedback.bestPractices}
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="solutionByAI" className="mt-4">
                      <AISolutionTab answer={answer} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedbackPage;
