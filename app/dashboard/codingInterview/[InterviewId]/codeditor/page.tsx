import React from "react";
import CodingInterviewPage from "./_components/CodingPage";

interface InterviewPageProps {
  params: Promise<{ InterviewId: string }>;
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  // Note the capital "I" to match the route parameter name
  const { InterviewId } = await params;
  console.log("InterviewId", InterviewId);

  return (
    <div className="w-full h-full">
      <CodingInterviewPage interviewId={InterviewId} />
    </div>
  );
}
