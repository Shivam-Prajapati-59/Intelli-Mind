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
  model: "gemini-1.5-pro",
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

// Interface for the expected request body
interface FeedbackRequest {
  question: string;
  code: string;
  explanation?: string;
}

// Interface for the parsed feedback response
interface FeedbackResponse {
  rating: number;
  technicalAccuracy: number;
  codeQuality: number;
  feedback: {
    strengths: string[];
    improvements: string[];
    complexityAnalysis: string;
    bestPractices: string[]; // Changed from string to string[]
  };
}

// Utility function to sanitize input text
function sanitizeInput(text: string): string {
  // Remove any potential harmful characters or patterns
  return text.replace(/[^\w\s.,(){}[\]<>+=\-*/%&|^!?:;@#$'"`~/\\]/g, "").trim();
}

// Validate the structure of the feedback response
function validateFeedbackResponse(feedback: any): feedback is FeedbackResponse {
  return (
    feedback &&
    typeof feedback === "object" &&
    typeof feedback.rating === "number" &&
    typeof feedback.technicalAccuracy === "number" &&
    typeof feedback.codeQuality === "number" &&
    feedback.feedback &&
    Array.isArray(feedback.feedback.strengths) &&
    Array.isArray(feedback.feedback.improvements) &&
    typeof feedback.feedback.complexityAnalysis === "string" &&
    Array.isArray(feedback.feedback.bestPractices)
  );
}

// Function to validate and parse the request body
function validateRequest(body: any): FeedbackRequest {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request body");
  }

  const { question, code, explanation } = body;

  if (!question || typeof question !== "string") {
    throw new Error("Question is required and must be a string");
  }

  if (!code || typeof code !== "string") {
    throw new Error("Code is required and must be a string");
  }

  return {
    question: sanitizeInput(question),
    code: sanitizeInput(code),
    explanation: explanation ? sanitizeInput(explanation) : undefined,
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log("Received request for coding feedback generation");

    // Parse request body with error handling
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate and sanitize request data
    let validatedData: FeedbackRequest;
    try {
      validatedData = validateRequest(body);
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : "Invalid request data",
        },
        { status: 400 }
      );
    }

    const { question, code, explanation } = validatedData;

    console.log("Validated question:", question);
    console.log("Validated code:", code);
    console.log("Validated explanation:", explanation);

    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
    });

    const prompt = `
You are an expert coding interviewer and technical assessor. Please analyze the following coding solution and provide solid detailed feedback.

Question: ${question}
Code Solution:
${code}
${explanation ? `Candidate's Explanation: ${explanation}` : ""}

Provide your response in the following JSON format:
{
  "rating": <number between 1-10>,
  "technicalAccuracy": <number between 1-10>,
  "codeQuality": <number between 1-10>,
  "feedback": {
    "strengths": ["<string>", "<string>"],
    "improvements": ["<string>", "<string>"],
    "complexityAnalysis": "<string>",
    "bestPractices": ["<string>", "<string>"]
  }
}

Focus on:
1. Correctness of the solution
2. Time and space complexity
3. Code organization and readability
4. Use of appropriate data structures
5. Error handling and edge cases
6. Coding best practices

Keep the feedback professional and constructive. Do not include any additional text outside of the JSON structure.
Ensure that bestPractices is provided as an array of strings.
`;

    // console.log("Sending prompt to Gemini");
    const result = await chatSession.sendMessage(prompt);
    const responseText = await result.response.text();
    // console.log("Raw response from Gemini:", responseText);

    if (!responseText?.trim()) {
      throw new Error("Empty response from Gemini");
    }

    let parsedFeedback;
    try {
      // Parse the JSON response
      const filtered = responseText.replace("```json", "").replace("```", "");
      parsedFeedback = JSON.parse(filtered);

      // Handle case where bestPractices is a string
      if (typeof parsedFeedback.feedback.bestPractices === "string") {
        parsedFeedback.feedback.bestPractices = [
          parsedFeedback.feedback.bestPractices,
        ];
      }

      // Validate the parsed feedback structure
      if (!validateFeedbackResponse(parsedFeedback)) {
        throw new Error("Invalid feedback response structure");
      }

      // Ensure ratings are within bounds
      const normalizeRating = (rating: number) =>
        Math.max(1, Math.min(10, Math.round(rating)));

      parsedFeedback.rating = normalizeRating(parsedFeedback.rating);
      parsedFeedback.technicalAccuracy = normalizeRating(
        parsedFeedback.technicalAccuracy
      );
      parsedFeedback.codeQuality = normalizeRating(parsedFeedback.codeQuality);

      // Ensure arrays are not empty
      if (parsedFeedback.feedback.strengths.length === 0) {
        parsedFeedback.feedback.strengths = [
          "No specific strengths identified",
        ];
      }
      if (parsedFeedback.feedback.improvements.length === 0) {
        parsedFeedback.feedback.improvements = [
          "No specific improvements identified",
        ];
      }
      if (parsedFeedback.feedback.bestPractices.length === 0) {
        parsedFeedback.feedback.bestPractices = [
          "No specific best practices identified",
        ];
      }

      // console.log(
      //   "Successfully parsed and validated feedback:",
      //   parsedFeedback
      // );
    } catch (parseError) {
      console.error("Feedback parsing error:", parseError);
      console.error("Raw response that failed parsing:", responseText);

      const fallbackFeedback = {
        rating: 5,
        technicalAccuracy: 5,
        codeQuality: 5,
        feedback: {
          strengths: ["Unable to analyze strengths"],
          improvements: ["Unable to analyze improvements"],
          complexityAnalysis: "Analysis unavailable",
          bestPractices: ["Best practices analysis unavailable"],
        },
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
      );
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
    message: "Coding Question Feedback Generator API",
    status: "operational",
    endpoints: {
      POST: {
        description: "Generate feedback for coding solutions",
        requiredParams: {
          question: "The coding question (required)",
          code: "The solution code (required)",
          explanation: "The candidate's explanation (optional)",
        },
        returns: {
          feedback: {
            rating: "overall rating (1-10)",
            technicalAccuracy: "technical accuracy rating (1-10)",
            codeQuality: "code quality rating (1-10)",
            feedback: {
              strengths: "array of strength points",
              improvements: "array of improvement suggestions",
              complexityAnalysis: "time/space complexity analysis",
              bestPractices: "array of best practices points",
            },
          },
          metadata: {
            generatedAt: "ISO timestamp",
          },
        },
      },
    },
  });
}
