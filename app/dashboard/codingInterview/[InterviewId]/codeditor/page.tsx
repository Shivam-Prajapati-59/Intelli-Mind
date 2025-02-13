import React from "react";
import CodingInterviewPage from "./_components/CodingPage";

type InterviewParams = {
  InterviewId: string;
};

interface PageProps {
  params: Promise<InterviewParams>;
}

export default async function CodeEditorPage({ params }: PageProps) {
  const InterviewId = (await params).InterviewId;

  return (
    <div className="w-full h-full">
      <CodingInterviewPage interviewId={InterviewId} />
    </div>
  );
}
