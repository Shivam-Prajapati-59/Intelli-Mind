import React from "react";
import CodingInterviewPage from "./_components/CodingPage";

interface PageProps {
  params: {
    slug: string[]; // Expecting a dynamic segment like ['someValue', 'InterviewId']
  };
}

export default async function InterviewPage({ params }: PageProps) {
  const interviewId = params.slug?.[1]; // Extracting the InterviewId

  if (!interviewId) {
    return <div>Invalid Interview ID</div>;
  }

  return (
    <div className="w-full h-full">
      <CodingInterviewPage params={{ InterviewId: interviewId }} />
    </div>
  );
}
