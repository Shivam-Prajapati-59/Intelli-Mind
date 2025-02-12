import { NextResponse } from "next/server";

const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

export async function POST(request: Request) {
  const { language, code } = await request.json();

  let pistonLanguage: string;
  if (language === "java") {
    pistonLanguage = "java";
  } else if (language === "cpp") {
    pistonLanguage = "cpp";
  } else {
    return NextResponse.json(
      { error: "Unsupported language" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(PISTON_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: pistonLanguage,
        version: "*",
        files: [
          {
            content: code,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.run && data.run.output) {
      return NextResponse.json({ output: data.run.output });
    } else {
      return NextResponse.json(
        { error: "Compilation or execution failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error compiling and running code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
