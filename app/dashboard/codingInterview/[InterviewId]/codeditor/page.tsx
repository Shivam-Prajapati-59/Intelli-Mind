import React from "react";
import CodingInterviewPage from "./_components/CodingPage";

type Props = {
  params: Promise<{ InterviewId: string }>; // Notice the uppercase "I"
};

export default async function InterviewPage({ params }: Props) {
  const resolvedParams = await params; // Await the params

  console.log("Resolved Params:", resolvedParams); // Debugging

  return (
    <div className="w-full h-full">
      <CodingInterviewPage
        params={{ interviewId: resolvedParams.InterviewId }}
      />
    </div>
  );
}
