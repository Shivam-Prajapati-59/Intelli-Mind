import { db } from "@/utils/db";
import { CodingInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import InterviewClient from "./CodingInterviewClient";
import CodingInterviewClient from "./CodingInterviewClient";

type Props = {
  params: { InterviewId: string };
};

async function getInterviewDetails(interviewId: string | undefined) {
  // console.log("Fetching interview details for ID:", interviewId);

  if (!interviewId) {
    console.error("Interview ID is undefined");
    return null;
  }

  try {
    const result = await db
      .select()
      .from(CodingInterview)
      .where(eq(CodingInterview.interviewId, interviewId));

    return result[0] || null;
  } catch (error) {
    console.error("Error fetching interview details:", error);
    return null;
  }
}

export default async function InterviewPage({ params }: Props) {
  const resolvedParams = params instanceof Promise ? await params : params;

  if (!resolvedParams || !resolvedParams.InterviewId) {
    console.error("Invalid params or missing InterviewId");
    return (
      <div className="text-center text-red-500 text-xl mt-10">
        Invalid interview parameters.
      </div>
    );
  }

  const { InterviewId } = resolvedParams;

  const interviewDetails = await getInterviewDetails(InterviewId);

  if (!interviewDetails) {
    return (
      <div className="text-center text-red-500 text-xl mt-10">
        Interview not found or error occurred.
      </div>
    );
  }

  return <CodingInterviewClient interviewDetails={interviewDetails} />;
}
