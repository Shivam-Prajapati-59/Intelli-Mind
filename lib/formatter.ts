import prettier from "prettier";
import parserJava from "prettier-plugin-java";

export async function formatCode(
  code: string,
  language: "java" | "cpp"
): Promise<string> {
  if (language === "java") {
    try {
      const formattedCode = await prettier.format(code, {
        parser: "java",
        plugins: [parserJava],
        tabWidth: 4,
        useTabs: false,
      });
      return formattedCode;
    } catch (error) {
      console.error("Error formatting Java code:", error);
      throw error;
    }
  } else if (language === "cpp") {
    // Simple indentation-based formatter for C++
    return formatCpp(code);
  } else {
    throw new Error("Unsupported language");
  }
}

function formatCpp(code: string): string {
  const lines = code.split("\n");
  let indentLevel = 0;
  const formattedLines = lines.map((line) => {
    line = line.trim();
    if (line.endsWith("{")) {
      const indentedLine = "    ".repeat(indentLevel) + line;
      indentLevel++;
      return indentedLine;
    } else if (line.startsWith("}")) {
      indentLevel = Math.max(0, indentLevel - 1);
      return "    ".repeat(indentLevel) + line;
    } else {
      return "    ".repeat(indentLevel) + line;
    }
  });
  return formattedLines.join("\n");
}
