// app/api/generate-feedback/route.ts
import { type NextRequest, NextResponse } from "next/server";
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
  model: "gemini-2.0-flash", // Changed to a more stable model
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
    // Log the incoming request
    console.log("Received request for feedback generation");

    const body = await request.json();
    const { question, answer } = body;

    // Log the received data
    console.log("Received question:", question);
    console.log("Received answer:", answer);

    if (!question?.trim() || !answer?.trim()) {
      console.log("Validation failed: Empty question or answer");
      return NextResponse.json(
        { error: "Question and answer are required and cannot be empty" },
        { status: 400 }
      );
    }

    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
    });

    const prompt = `
You are an expert interview coach. Please analyze the following interview response and provide feedback.

Question: ${question}
Answer: ${answer}

Provide your response in the following JSON format:
{
  "rating": <number between 1-10>,
  "feedback": "<constructive feedback>"
}

Keep the feedback concise but informative, focusing on both strengths and areas for improvement.
Do not include any additional text or formatting outside of the JSON structure.
`;

    console.log("Sending prompt to Gemini");
    const result = await chatSession.sendMessage(prompt);
    const responseText = await result.response.text();
    console.log("Raw response from Gemini:", responseText);

    if (!responseText?.trim()) {
      console.log("Error: Empty response from Gemini");
      return NextResponse.json(
        { error: "Failed to generate feedback: Empty response" },
        { status: 500 }
      );
    }

    let parsedFeedback;
    try {
      // Try to parse the response as JSON
      const filtered = responseText.replace("```json", "").replace("```", "");
      parsedFeedback = JSON.parse(filtered);

      // Validate the parsed feedback structure
      if (!parsedFeedback || typeof parsedFeedback !== "object") {
        throw new Error("Invalid response structure");
      }

      // Validate and sanitize the rating
      if (
        typeof parsedFeedback.rating !== "number" ||
        parsedFeedback.rating < 1 ||
        parsedFeedback.rating > 10
      ) {
        parsedFeedback.rating = 5; // Default rating if invalid
      }

      // Validate and sanitize the feedback text
      if (
        typeof parsedFeedback.feedback !== "string" ||
        !parsedFeedback.feedback.trim()
      ) {
        throw new Error("Invalid feedback text");
      }

      // console.log("Successfully parsed feedback:", parsedFeedback);
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError);
      console.error("Raw response that failed parsing:", responseText);

      // Attempt to extract feedback from non-JSON response
      const fallbackFeedback = {
        rating: 5,
        feedback:
          "We encountered an error processing the feedback. Please try again.",
      };

      return NextResponse.json(
        {
          feedback: fallbackFeedback,
          error: "Failed to parse AI response",
          metadata: {
            generatedAt: new Date().toISOString(),
            error: true,
          },
        },
        { status: 200 }
      ); // Return 200 with fallback feedback instead of 500
    }

    return NextResponse.json({
      feedback: parsedFeedback,
      metadata: {
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Fatal error in feedback generation:", error);
    return NextResponse.json(
      {
        error: "Failed to generate feedback",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Interview Answer Feedback Generator API",
    status: "operational",
    endpoints: {
      POST: {
        description: "Generate feedback for interview answers",
        requiredParams: {
          question: "The interview question (required)",
          answer: "The user's answer (required)",
        },
        returns: {
          feedback: {
            rating: "number (1-10)",
            feedback: "string",
          },
          metadata: {
            generatedAt: "ISO timestamp",
          },
        },
      },
    },
  });
}
