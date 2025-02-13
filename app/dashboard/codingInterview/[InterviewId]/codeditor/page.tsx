import React from "react";
import CodingInterviewPage from "./_components/CodingPage";

type Props = {
  params: { interviewId: string };
};

export default async function InterviewPage({ params }: Props) {
  const { interviewId: InterviewId } = params; // Extracting the InterviewId

  return (
    <div className="w-full h-full">
      <CodingInterviewPage params={{ InterviewId }} />
    </div>
  );
}
