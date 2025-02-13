import React from "react";
import CodingInterviewPage from "./_components/CodingPage";
import { PageProps } from "@/.next/types/app/page";

export default async function InterviewPage({ params }: PageProps) {
  const resolvedParams = await params; // Await params as it's a Promise

  return (
    <div className="w-full h-full">
      <CodingInterviewPage params={resolvedParams} />
    </div>
  );
}
