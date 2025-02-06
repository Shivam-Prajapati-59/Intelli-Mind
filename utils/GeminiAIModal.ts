const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
async function uploadToGemini(path: any, mimeType: any) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

/**
 * Waits for the given files to be active.
 *
 * Some files uploaded to the Gemini API need to be processed before they can
 * be used as prompt inputs. The status can be seen by querying the file's
 * "state" field.
 *
 * This implementation uses a simple blocking polling loop. Production code
 * should probably employ a more sophisticated approach.
 */
async function waitForFilesActive(files: any) {
  console.log("Waiting for file processing...");
  for (const name of files.map((file: any) => file.name)) {
    let file = await fileManager.getFile(name);
    while (file.state === "PROCESSING") {
      process.stdout.write(".");
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(name);
    }
    if (file.state !== "ACTIVE") {
      throw Error(`File ${file.name} failed to process`);
    }
  }
  console.log("...all files ready\n");
}

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};
export async function sendInterviewRequest(formData: {
  jobPosition: string;
  jobDescription: string;
  yearsOfExperience: number;
  resume: File | null;
  resumeText: string;
}) {
  let fileUri = null;

  if (formData.resume) {
    // Convert File to ArrayBuffer
    const arrayBuffer = await formData.resume.arrayBuffer();
    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(arrayBuffer);

    // Upload the buffer directly
    const uploadResult = await fileManager.uploadContent(buffer, {
      mimeType: "application/pdf",
      displayName: formData.resume.name,
    });

    fileUri = uploadResult.file.uri;
  }

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          formData.resume
            ? {
                fileData: {
                  mimeType: "application/pdf",
                  fileUri: fileUri,
                },
              }
            : null,
          {
            text: `Job Position: ${formData.jobPosition}, Job Description: ${
              formData.jobDescription
            }, Years of Experience: ${formData.yearsOfExperience}, resume: ${
              formData.resume ? "file uploaded" : "not provided"
            }. Based on this information, please give me 5 Interview questions with Answers in JSON Format, with Question and Answer as fields in the JSON.`,
          },
        ].filter(Boolean), // Remove null values from parts array
      },
    ],
  });

  const result = await chatSession.sendMessage({
    role: "user",
    parts: [
      {
        text: "Generate interview questions based on the provided information.",
      },
    ],
  });

  return result.response.text();
}
