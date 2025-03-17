import { type NextRequest, NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerationConfig,
  SafetySetting,
} from "@google/generative-ai";

export const runtime = "edge";

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

const initializeGeminiApi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
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
    6. hints
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
  `.trim();
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const topic = formData.get("topic");

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Topic is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const model = initializeGeminiApi();
    const chatSession = model.startChat({
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
    });

    const result = await chatSession.sendMessage(generatePrompt(topic.trim()));
    const responseText = await result.response.text();

    return new NextResponse(responseText, {
      headers: {
        "Content-Type": "application/json",
        Connection: "keep-alive",
        "Keep-Alive": "timeout=60",
      },
    });
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
