import React from "react";
import CodingInterviewPage from "./_components/CodingPage";

type Params = {
  slug: string;
};

export default async function InterviewPage({ params }: { params: Params }) {
  return (
    <div className="w-full h-full">
      <CodingInterviewPage params={params.slug} />
    </div>
  );
}
