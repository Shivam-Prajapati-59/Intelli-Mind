import React from "react";
import CodingInterviewPage from "./_components/CodingPage";

type Props = {
  params: Promise<{
    InterviewId: string; // Note the capital 'I' to match your route
  }>;
};

export default async function InterviewPage({ params }: Props) {
  const resolvedParams = await params;
  const { InterviewId } = resolvedParams;

  return (
    <div className="w-full h-full">
      <CodingInterviewPage params={{ interviewId: InterviewId }} />
    </div>
  );
}
