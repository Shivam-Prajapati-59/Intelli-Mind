// app/dashboard/codingInterview/[InterviewId]/page.tsx
import React from "react";
import CodingInterviewPage from "./_components/CodingPage";

interface PageProps {
  params: Promise<{
    InterviewId: string;
  }>;
}

export default async function InterviewPage({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <div className="w-full h-full">
      <CodingInterviewPage params={resolvedParams} />
    </div>
  );
}
