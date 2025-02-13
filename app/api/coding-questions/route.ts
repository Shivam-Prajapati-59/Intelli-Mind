import { type NextRequest, NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerationConfig,
  SafetySetting,
} from "@google/generative-ai";

// Type definitions for better type safety
interface QuestionExample {
  input: string;
  output: string;
  explanation: string;
}

interface QuestionSolution {
  cpp: string;
  java: string;
}

interface CodingQuestion {
  title: string;
  description: string;
  examples: QuestionExample[];
  constraints: string[];
  solution: QuestionSolution;
  explanation: string;
}

interface ApiResponse {
  questions: CodingQuestion[];
  metadata: {
    topic: string;
    generatedAt: string;
  };
}

// Configuration
const GENERATION_CONFIG: GenerationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 32,
  maxOutputTokens: 4096,
};

const SAFETY_SETTINGS: SafetySetting[] = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Initialize Gemini API
const initializeGeminiApi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

const generatePrompt = (topic: string): string => {
  return `
    Generate 3 coding questions related to the topic: ${topic}

    For each question, provide:
    1. Title
    2. Description
    3. Examples (input, output, and explanation)
    4. difficulty level
    5. Constraints
    6.  hints
    7. Solution in C++ and Java
    8. Explanation of the solution

    Format the response as a JSON array with the following structure:
    [
      {
        "title": "Question Title",
        "description": "Question description",
        "examples": [
          {
            "input": "Example input",
            "output": "Example output",
            "explanation": "Explanation of the example"
          }
        ],
        "difficulty": "Medium",
        "constraints": [
          "Constraint 1",
          "Constraint 2"
        ],
        "hints": [
        "Hint 1",
        "Hint 2"
        ],
        "solution": {
          "cpp": "C++ code here",
          "java": "Java code here"
        },
        "explanation": "Explanation of the solution"
      }
    ]

    Ensure that the generated questions are unique, challenging, and relevant to the given topic.
  `.trim();
};

export async function POST(request: NextRequest) {
  try {
    // Input validation
    const formData = await request.formData();
    const topic = formData.get("topic");

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Topic is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Initialize model
    const model = initializeGeminiApi();
    const chatSession = model.startChat({
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
    });

    // Generate questions
    const result = await chatSession.sendMessage(generatePrompt(topic.trim()));
    // console.log("AI Result:", result);

    const responseText = await result.response.text();
    // console.log("AI Response:", responseText);

    return NextResponse.json(responseText);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        error: "Failed to generate coding questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Coding Questions Generator API",
    version: "1.0",
    endpoints: {
      POST: {
        description: "Generate custom coding questions",
        requiredParams: {
          topic:
            "string (required) - The programming topic to generate questions for",
        },
        responseFormat: {
          questions: "Array of coding questions with detailed structure",
          metadata: {
            topic: "string - The requested topic",
            generatedAt: "ISO timestamp",
          },
        },
      },
    },
  });
}
