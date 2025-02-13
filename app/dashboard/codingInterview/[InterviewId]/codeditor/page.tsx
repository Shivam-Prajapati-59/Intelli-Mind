import React from "react";
import CodingInterviewPage from "./_components/CodingPage";

type Props = {
  params: Promise<{
    InterviewId: string; // Note the capital 'I' to match your route
  }>;
};

export default async function InterviewPage({ params }: Props) {
  const { InterviewId } = await params;

  return (
    <div className="w-full h-full">
      <CodingInterviewPage params={InterviewId} />
    </div>
  );
}
