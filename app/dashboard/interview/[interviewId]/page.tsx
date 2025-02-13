import { db } from "@/utils/db";
import { MOCKInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import InterviewClient from "./InterviewClient";

type Props = {
  params: Promise<{ interviewId: string }>;
};

async function getInterviewDetails(interviewId: string) {
  try {
    const result = await db
      .select()
      .from(MOCKInterview)
      .where(eq(MOCKInterview.mockId, interviewId));
    return result[0];
  } catch (error) {
    console.error("Error fetching interview details:", error);
    return null;
  }
}

export default async function InterviewPage(props: Props) {
  const params = await props.params;
  const { interviewId } = params;
  console.log("Interview page loaded", interviewId);

  const interviewDetails = await getInterviewDetails(interviewId);

  if (!interviewDetails) {
    return (
      <div className="text-center text-red-500 text-xl mt-10">
        Interview not found or error occurred.
      </div>
    );
  }

  return <InterviewClient interviewDetails={interviewDetails} />;
}
