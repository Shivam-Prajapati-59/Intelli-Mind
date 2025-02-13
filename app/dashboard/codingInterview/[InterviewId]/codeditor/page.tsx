import React from "react";
import CodingInterviewPage from "./_components/CodingPage";
import { PageProps } from "@/.next/types/app/dashboard/codingInterview/[InterviewId]/page";
// import { PageProps } from "next"; // Importing PageProps for type safety

export default async function InterviewPage({ params }: PageProps) {
  const resolvedParams = await params; // Await the promise

  return (
    <div className="w-full h-full">
      <CodingInterviewPage
        params={{ interviewId: resolvedParams.InterviewId }}
      />
    </div>
  );
}
