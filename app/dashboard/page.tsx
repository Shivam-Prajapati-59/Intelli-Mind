"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import {
  Activity,
  Code,
  Users,
  Clock,
  Target,
  Award,
  Loader2,
} from "lucide-react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";
import AddNewCodingInterview from "./_components/AddNewCodingInterview";
import CodingInterviewList from "./_components/CodingInterviewList";
import { db } from "@/utils/db";

import { MOCKInterview, CodingInterview } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

// Types
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

const DashboardStats = () => {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState({
    totalMockInterviews: 0,
    successRate: 0,
    totalSessions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isLoaded || !user?.primaryEmailAddress?.emailAddress) return;

      try {
        const codingInterviews = await db
          .select()
          .from(CodingInterview)
          .where(
            eq(CodingInterview.createdBy, user.primaryEmailAddress.emailAddress)
          );

        // Calculate total mock interviews - assuming there's a similar Interview table
        const mockInterviews = await db
          .select()
          .from(MOCKInterview)
          .where(
            eq(MOCKInterview.createdBy, user.primaryEmailAddress.emailAddress)
          );
        const totalMockInterviews = mockInterviews.length;

        // Calculate total sessions (both mock and coding)
        const totalSessions = codingInterviews.length + totalMockInterviews;

        // Calculate success rate (interviews with solutions)
        const successfulInterviews = codingInterviews.filter(
          (interview) =>
            interview.jsonCodeResp && interview.jsonCodeResp.length > 0
        );
        const successRate =
          totalSessions > 0
            ? Math.round((successfulInterviews.length / totalSessions) * 100)
            : 0;

        setStats({ totalMockInterviews, successRate, totalSessions });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user, isLoaded]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-200"
          >
            <div className="flex justify-center items-center h-16">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Mock Interviews</p>
            <p className="text-xl font-semibold text-gray-900">
              {stats.totalMockInterviews}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Success Rate</p>
            <p className="text-xl font-semibold text-gray-900">
              {stats.successRate}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Sessions</p>
            <p className="text-xl font-semibold text-gray-900">
              {stats.totalSessions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ${inter.className}`}
    >
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200 backdrop-blur-sm bg-white/80 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-8 h-8 text-blue-600" />
                Interview Prep Hub
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Master both behavioral and technical interviews
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-2 rounded-lg">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <DashboardStats />

        {/* Main Content - Split Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mock Interviews Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="w-6 h-6 text-blue-600" />
                    Mock Interviews
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Master behavioral interviews
                  </p>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="space-y-6">
                <AddNewInterview />
                <div className="bg-gray-50 rounded-lg p-4">
                  <InterviewList />
                </div>
              </div>
            </div>
          </section>

          {/* Coding Interviews Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                    <Code className="w-6 h-6 text-green-600" />
                    Coding Interviews
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Practice technical challenges
                  </p>
                </div>
                <div className="bg-green-50 p-2 rounded-lg">
                  <Code className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="space-y-6">
                <AddNewCodingInterview />
                <div className="bg-gray-50 rounded-lg p-4">
                  <CodingInterviewList />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
