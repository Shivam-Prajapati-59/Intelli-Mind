import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 32,
  maxOutputTokens: 4096,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const jobPosition = formData.get("jobPosition") as string;
    const jobDescription = formData.get("jobDescription") as string;
    const yearsOfExperience = formData.get("yearsOfExperience") as string;
    const resumeText = formData.get("resumeText") as string;

    if (!jobPosition || !jobDescription) {
      return NextResponse.json(
        { error: "Job position and description are required" },
        { status: 400 }
      );
    }

    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
    });

    const prompt = `
Generate 5 interview questions for a ${jobPosition} role:
- Job Description: ${jobDescription}
- Experience Level: ${yearsOfExperience || "Not specified"}
- Resume Context: ${resumeText || "No additional context"}

Requirements:
1. Create unique, role-specific questions
2. Include mix of technical and behavioral questions
3. Format strictly as JSON array with 'Question' and 'Answer' keys
4. Answers should demonstrate professional insight
`;

    const result = await chatSession.sendMessage(prompt);
    const responseText = await result.response.text();

    return NextResponse.json({
      questions: responseText,
      metadata: {
        jobPosition,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to generate interview questions" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Interview Question Generator API",
    endpoints: {
      POST: "Generate custom interview questions",
      requiredParams: [
        "jobPosition (required)",
        "jobDescription (required)",
        "yearsOfExperience (optional)",
        "resumeText (optional)",
      ],
    },
  });
}
