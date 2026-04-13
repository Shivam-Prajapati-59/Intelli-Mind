import { NextResponse } from "next/server";

type SupportedLanguage = "java" | "cpp";

const languageConfig: Record<SupportedLanguage, { judge0LanguageId: number }> =
  {
    java: { judge0LanguageId: 62 },
    cpp: { judge0LanguageId: 54 },
  };

const getJudge0SubmissionsUrl = () => {
  const baseUrl = process.env.JUDGE0_API_URL?.trim() || "https://ce.judge0.com";
  return `${baseUrl.replace(/\/$/, "")}/submissions?base64_encoded=false&wait=true`;
};

const isSupportedLanguage = (value: string): value is SupportedLanguage =>
  value === "java" || value === "cpp";

export async function POST(request: Request) {
  const payload = await request.json();
  const language = payload?.language;
  const code = payload?.code;

  if (!language || !isSupportedLanguage(language)) {
    return NextResponse.json(
      { error: "Unsupported language" },
      { status: 400 },
    );
  }

  if (typeof code !== "string") {
    return NextResponse.json(
      { error: "Code must be a string" },
      { status: 400 },
    );
  }

  const judge0LanguageId = languageConfig[language].judge0LanguageId;

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (process.env.JUDGE0_AUTH_TOKEN) {
      headers["X-Auth-Token"] = process.env.JUDGE0_AUTH_TOKEN;
    }

    const response = await fetch(getJudge0SubmissionsUrl(), {
      method: "POST",
      headers,
      body: JSON.stringify({
        source_code: code,
        language_id: judge0LanguageId,
        stdin: "",
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        data?.message ||
        data?.error ||
        data?.status?.description ||
        "Code execution provider returned an error";

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    const output = [data?.compile_output, data?.stderr, data?.stdout]
      .filter((value) => typeof value === "string" && value.length > 0)
      .join("");

    const statusDescription = data?.status?.description || null;
    const statusId = data?.status?.id;

    return NextResponse.json({
      output,
      success: statusId === 3,
      status: statusDescription,
      execution: {
        stdout: data?.stdout ?? null,
        stderr: data?.stderr ?? null,
        compileOutput: data?.compile_output ?? null,
        time: data?.time ?? null,
        memory: data?.memory ?? null,
      },
    });
  } catch (error) {
    console.error("Error compiling and running code with Judge0:", error);
    return NextResponse.json(
      { error: "Failed to reach Judge0 execution service" },
      { status: 500 },
    );
  }
}
