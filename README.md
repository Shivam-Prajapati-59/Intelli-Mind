# 🎯 MockMind - AI-Powered Interview Platform

<div align="center">

![MockMind Logo](https://img.shields.io/badge/MockMind-AI%20Interview%20Platform-blue?style=for-the-badge&logo=robot)

[![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Authentication-purple?style=flat-square&logo=clerk)](https://clerk.com/)

_Revolutionizing interview preparation with AI-powered personalized practice sessions_

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-setup)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

**MockMind** is a sophisticated AI-powered interview preparation platform that provides realistic interview experiences through two comprehensive modes:

- **🎤 Traditional Interviews**: AI-generated questions with voice recording and intelligent feedback
- **💻 Coding Interviews**: Interactive programming challenges with real-time compilation and assessment

The platform leverages Google Gemini AI to create personalized interview experiences, analyze responses, and provide actionable feedback to help users excel in their job interviews.

## ✨ Features

### 🎯 Core Features

- **AI-Generated Questions**: Personalized interview questions based on job position and requirements
- **Resume Analysis**: Upload and analyze resumes for contextual question generation
- **Real-time Voice Recording**: Speech-to-text conversion for seamless interview simulation
- **Webcam Integration**: Video recording for realistic interview practice
- **Interactive Code Editor**: Full-featured coding environment with syntax highlighting
- **Live Code Compilation**: Real-time code execution and testing
- **Intelligent Feedback**: AI-powered analysis with detailed performance insights
- **Progress Tracking**: Comprehensive analytics and improvement recommendations

### 🔧 Technical Features

- **Responsive Design**: Mobile-first approach with beautiful UI/UX
- **Real-time Updates**: Live feedback and instant compilation results
- **Secure Authentication**: Robust user management with Clerk
- **Database Integration**: PostgreSQL with optimized queries
- **API-First Architecture**: RESTful APIs with comprehensive error handling
- **Performance Optimized**: Edge runtime and efficient resource management

## 🚀 Technology Stack

### Frontend

- **Framework**: Next.js 15.1.6 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Tailwind Animate
- **UI Components**: Radix UI primitives
- **Animation**: Framer Motion
- **Code Editor**: CodeMirror 6
- **Media**: React Webcam, Web Speech API

### Backend

- **Runtime**: Node.js (Edge Runtime)
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Authentication**: Clerk
- **AI Integration**: Google Gemini AI
- **Code Execution**: Piston API

### Development Tools

- **Package Manager**: npm/yarn/pnpm
- **Database Migration**: Drizzle Kit
- **Code Quality**: ESLint, Prettier
- **Type Safety**: TypeScript 5.0

## 🏛️ Architecture

### High-Level System Architecture

```mermaid
graph TB
    A[Client Layer - Next.js] --> B[Middleware - Clerk Auth]
    B --> C[API Layer - Next.js Routes]
    C --> D[AI Services - Gemini]
    C --> E[External APIs - Piston]
    C --> F[Database - PostgreSQL]

    subgraph "Client Features"
        A1[Interview UI]
        A2[Code Editor]
        A3[Voice Recording]
        A4[Webcam Integration]
    end

    subgraph "API Endpoints"
        C1[Interview Questions]
        C2[Coding Questions]
        C3[Feedback Generation]
        C4[Code Compilation]
    end

    A --> A1
    A --> A2
    A --> A3
    A --> A4

    C --> C1
    C --> C2
    C --> C3
    C --> C4
```

### Component Structure

```
app/
├── layout.tsx                    # Root layout with providers
├── page.tsx                      # Landing page
├── globals.css                   # Global styles
│
├── (auth)/                       # Authentication routes
│   ├── sign-in/[[...sign-in]]/
│   └── sign-up/[[...sign-up]]/
│
├── dashboard/                    # Main application
│   ├── layout.tsx               # Dashboard layout
│   ├── page.tsx                 # Dashboard home
│   ├── _components/             # Shared components
│   ├── interview/[interviewId]/ # Traditional interviews
│   └── codingInterview/[InterviewId]/ # Coding interviews
│
└── api/                         # API routes
    ├── interview-questions/
    ├── coding-questions/
    ├── generate-feedback/
    ├── coding-questions-feedback/
    └── compile/
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- PostgreSQL database (or Neon account)
- Clerk account for authentication
- Google AI API key for Gemini

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Prajapatishivam65/Intelli-Mind.git
   cd mockmind
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure the database**

   ```bash
   npm run db:push
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔧 Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database Configuration
NEXT_PUBLIC_DRIZZLE_DB_URL=postgresql://username:password@host:port/database

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Google AI (Gemini)
GEMINI_API_KEY=AIza...

# External APIs
PISTON_API_URL=https://emkc.org/api/v2/piston/execute
```

### Environment Variables Description

| Variable                            | Description                           | Required |
| ----------------------------------- | ------------------------------------- | -------- |
| `NEXT_PUBLIC_DRIZZLE_DB_URL`        | PostgreSQL database connection string | ✅       |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key for client-side auth | ✅       |
| `CLERK_SECRET_KEY`                  | Clerk secret key for server-side auth | ✅       |
| `GEMINI_API_KEY`                    | Google AI API key for Gemini models   | ✅       |
| `PISTON_API_URL`                    | Code execution service endpoint       | ✅       |

## 📊 Database Schema

### Core Tables

#### MockInterview

```sql
CREATE TABLE mock_interview (
  id SERIAL PRIMARY KEY,
  jsonMockResp TEXT NOT NULL,           -- AI-generated questions (JSON)
  jobPosition VARCHAR NOT NULL,         -- Target job position
  jobDescription VARCHAR NOT NULL,      -- Job requirements
  jobExperience VARCHAR NOT NULL,       -- Required experience level
  fileData TEXT,                        -- Parsed resume content
  createdBy VARCHAR NOT NULL,           -- User identifier
  createdAt VARCHAR NOT NULL,           -- Creation timestamp
  mockId VARCHAR NOT NULL               -- Unique interview ID
);
```

#### UserAnswer

```sql
CREATE TABLE userAnswer (
  id SERIAL PRIMARY KEY,
  mockIdRef VARCHAR NOT NULL,           -- Interview reference
  question VARCHAR NOT NULL,            -- Interview question
  correctAnswer TEXT NOT NULL,          -- Model answer
  UserAns TEXT NOT NULL,               -- User response
  feedback VARCHAR NOT NULL,            -- AI feedback
  rating VARCHAR NOT NULL,              -- Score (1-10)
  userEmail VARCHAR NOT NULL,           -- User identifier
  createdAt VARCHAR NOT NULL            -- Response timestamp
);
```

#### CodingInterview

```sql
CREATE TABLE coding_interview (
  id SERIAL PRIMARY KEY,
  jsonCodeResp TEXT NOT NULL,          -- Coding questions (JSON)
  interviewId VARCHAR NOT NULL UNIQUE,  -- Session ID
  interviewTopic VARCHAR NOT NULL,      -- Programming topic
  difficultyLevel VARCHAR NOT NULL,     -- Easy/Medium/Hard
  problemDescription TEXT NOT NULL,     -- Problem statement
  timeLimit VARCHAR NOT NULL,           -- Session duration
  programmingLanguage VARCHAR NOT NULL, -- Language choice
  createdBy VARCHAR NOT NULL,           -- User identifier
  createdAt TIMESTAMP NOT NULL         -- Creation timestamp
);
```

#### UserCodeAnswer

```sql
CREATE TABLE userCodeAnswer (
  id SERIAL PRIMARY KEY,
  interviewIdRef VARCHAR NOT NULL,      -- Coding interview reference
  question TEXT NOT NULL,               -- Coding problem
  correctAnswer TEXT NOT NULL,          -- Model solution
  userAnswer TEXT NOT NULL,            -- User's code
  feedback TEXT NOT NULL,              -- Detailed feedback (JSON)
  rating VARCHAR NOT NULL,             -- Performance score
  userEmail VARCHAR NOT NULL,          -- User identifier
  createdAt TIMESTAMP NOT NULL,        -- Submission time
  language VARCHAR NOT NULL            -- Programming language
);
```

### Database Commands

```bash
# Push schema changes
npm run db:push

# Open database studio
npm run db:studio

# Generate migrations
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate
```

## 📡 API Documentation

### Interview Questions API

**Endpoint**: `POST /api/interview-questions`

Generate personalized interview questions based on job requirements.

```typescript
// Request
{
  jobPosition: string;
  jobDescription: string;
  yearsOfExperience?: string;
  resumeText?: string;
}

// Response
{
  questions: Array<{
    Question: string;
    Answer: string;
  }>;
}
```

### Coding Questions API

**Endpoint**: `POST /api/coding-questions`

Create programming challenges for coding interviews.

```typescript
// Request
{
  topic: string;
}

// Response
{
  questions: Array<{
    title: string;
    description: string;
    examples: Array<{
      input: string;
      output: string;
      explanation: string;
    }>;
    difficulty: string;
    constraints: string[];
    hints: string[];
    solution: {
      cpp: string;
      java: string;
    };
    explanation: string;
  }>;
}
```

### Feedback Generation API

**Endpoint**: `POST /api/generate-feedback`

Analyze interview responses and provide constructive feedback.

```typescript
// Request
{
  question: string;
  answer: string;
}

// Response
{
  feedback: {
    rating: number; // 1-10
    feedback: string;
  }
  metadata: {
    generatedAt: string;
  }
}
```

### Coding Feedback API

**Endpoint**: `POST /api/coding-questions-feedback`

Comprehensive analysis of coding solutions.

```typescript
// Request
{
  question: string;
  code: string;
  explanation?: string;
}

// Response
{
  feedback: {
    rating: number;
    technicalAccuracy: number;
    codeQuality: number;
    feedback: {
      strengths: string[];
      improvements: string[];
      complexityAnalysis: string;
      bestPractices: string[];
    };
  };
  metadata: {
    generatedAt: string;
  };
}
```

### Code Compilation API

**Endpoint**: `POST /api/compile`

Execute code in real-time with multiple language support.

```typescript
// Request
{
  language: "java" | "cpp";
  code: string;
}
```

## 🔍 Detailed Implementation Architecture

### 📊 Advanced Database Query Patterns

#### Complex Query Examples with Drizzle ORM

**1. Fetching User-Specific Interview Data with Joins**

```typescript
// Real implementation from InterviewList.tsx
const getInterviewList = async () => {
  const result = await db
    .select({
      id: MOCKInterview.id,
      jobPosition: MOCKInterview.jobPosition,
      jobDescription: MOCKInterview.jobDescription,
      jobExperience: MOCKInterview.jobExperience,
      createdAt: MOCKInterview.createdAt,
      mockId: MOCKInterview.mockId,
      jsonMockResp: MOCKInterview.jsonMockResp,
      fileData: MOCKInterview.fileData,
      createdBy: MOCKInterview.createdBy,
    })
    .from(MOCKInterview)
    .where(eq(MOCKInterview.createdBy, user.primaryEmailAddress.emailAddress))
    .orderBy(desc(MOCKInterview.id));
};
```

**2. Complex Multi-Condition Query for Existing Answers**

```typescript
// From CodingPage.tsx - Finding existing user submissions
const fetchExistingAnswer = async () => {
  const existingAnswers = await db
    .select()
    .from(UserCodeAnswer)
    .where(
      and(
        eq(UserCodeAnswer.interviewIdRef, interviewId),
        eq(
          UserCodeAnswer.question,
          JSON.stringify(codingInterviewQuestions[activeQuestionIndex])
        ),
        eq(UserCodeAnswer.userEmail, user.primaryEmailAddress.emailAddress)
      )
    );
};
```

**3. Advanced Insert with Returning Values**

```typescript
// From AddNewInterview.tsx - Creating new interview session
const result = await db
  .insert(MOCKInterview)
  .values({
    mockId: uuidv4(),
    jsonMockResp: MockJson,
    jobPosition: formData.jobPosition,
    jobDescription: formData.jobDescription,
    jobExperience: formData.yearsOfExperience.toString(),
    fileData: formData.resume
      ? JSON.stringify({
          fileName: formData.resume.name,
          fileType: formData.resume.type,
          fileSize: formData.resume.size,
        })
      : null,
    createdBy: user?.primaryEmailAddress?.emailAddress ?? "unknown",
    createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
  })
  .returning({ insertedId: MOCKInterview.mockId });
```

**4. Upsert Pattern for User Answers**

```typescript
// Advanced upsert logic for saving/updating user responses
const saveUserAnswer = async () => {
  // Check if answer exists
  const existingAnswers = await db
    .select()
    .from(UserAnswer)
    .where(
      and(
        eq(UserAnswer.mockIdRef, interviewData.mockId),
        eq(
          UserAnswer.question,
          mockInterviewQuestions[activeQuestionIndex].Question
        ),
        eq(UserAnswer.userEmail, user.primaryEmailAddress.emailAddress)
      )
    );

  if (existingAnswers.length > 0) {
    // Update existing answer
    await db
      .update(UserAnswer)
      .set({
        UserAns: transcript,
        feedback: JSON.stringify(feedback),
        rating: feedback.rating.toString(),
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      })
      .where(eq(UserAnswer.id, existingAnswers[0].id));
  } else {
    // Insert new answer
    await db.insert(UserAnswer).values({
      mockIdRef: interviewData.mockId,
      question: mockInterviewQuestions[activeQuestionIndex].Question,
      correctAnswer: mockInterviewQuestions[activeQuestionIndex].Answer,
      UserAns: transcript,
      feedback: JSON.stringify(feedback),
      rating: feedback.rating.toString(),
      userEmail: user.primaryEmailAddress.emailAddress,
      createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
  }
};
```

### 🎤 Advanced Speech Recognition Implementation

#### Real-time Voice Recording System

**1. Complete Speech Recognition Setup**

```typescript
// From RecordAnswer.tsx - Production-ready speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const startRecording = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    toast({
      title: "Error",
      description: "Speech recognition is not supported in this browser.",
      variant: "destructive",
    });
    return;
  }

  setIsRecording(true);
  recognitionRef.current = new SpeechRecognition();

  // Advanced configuration
  recognitionRef.current.continuous = true; // Keep listening
  recognitionRef.current.interimResults = true; // Get partial results
  recognitionRef.current.lang = "en-US"; // Set language
  recognitionRef.current.maxAlternatives = 1; // Best result only

  // Real-time result processing
  recognitionRef.current.onresult = (event: any) => {
    const currentTranscript = Array.from(event.results)
      .map((result: any) => result[0].transcript)
      .join(" ");
    setTranscript(currentTranscript.trim());
  };

  // Comprehensive error handling
  recognitionRef.current.onerror = (event: any) => {
    console.error("Speech recognition error", event.error);
    handleSpeechRecognitionError(event.error);
    setIsRecording(false);
  };

  recognitionRef.current.onend = () => {
    setIsRecording(false);
  };

  try {
    recognitionRef.current.start();
  } catch (error) {
    console.error("Error starting speech recognition:", error);
    setIsRecording(false);
  }
};
```

**2. Advanced Error Handling for Speech Recognition**

```typescript
const handleSpeechRecognitionError = (error: string) => {
  let errorMessage = "An error occurred with speech recognition.";

  switch (error) {
    case "network":
      errorMessage =
        "Network error. Please check your internet connection and try again.";
      break;
    case "not-allowed":
    case "permission-denied":
      errorMessage =
        "Microphone access denied. Please allow microphone access and try again.";
      break;
    case "no-speech":
      errorMessage = "No speech detected. Please try speaking again.";
      break;
    case "audio-capture":
      errorMessage =
        "Audio capture failed. Please check your microphone and try again.";
      break;
    case "aborted":
      errorMessage = "Speech recognition was aborted. Please try again.";
      break;
  }

  toast({
    title: "Speech Recognition Error",
    description: errorMessage,
    variant: "destructive",
  });
};
```

**3. Answer Validation and Quality Control**

```typescript
// Automatic validation of recorded answers
useEffect(() => {
  if (!isRecording && transcript) {
    const words = transcript.trim().split(/\s+/);
    if (words.length < 10) {
      setTranscript("");
      toast({
        title: "Answer too short",
        description:
          "Your answer should be at least 10 words long. Please try again.",
        variant: "destructive",
      });
    }
  }
}, [isRecording, transcript]);
```

### 💻 Advanced Code Editor Implementation

#### CodeMirror 6 Integration with Custom Features

**1. Complete Editor Setup with Language Support**

```typescript
// From CodeEditor.tsx - Production-grade code editor
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { foldGutter } from "@codemirror/language";
import { history, historyKeymap } from "@codemirror/commands";
import { bracketMatching } from "@codemirror/language";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";

const languageExtensions = {
  java: java(),
  cpp: cpp(),
};

// Advanced editor configuration
const createEditorState = (code: string, language: "java" | "cpp") => {
  return EditorState.create({
    doc: code,
    extensions: [
      basicSetup,
      languageExtensions[language],
      history(),
      foldGutter(),
      bracketMatching(),
      keymap.of([...historyKeymap, indentWithTab, ...defaultKeymap]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChange(update.state.doc.toString());
        }
      }),
      EditorView.theme({
        "&": {
          fontSize: `${settings.fontSize}px`,
          fontFamily: settings.fontFamily,
          lineHeight: settings.lineHeight.toString(),
        },
        ".cm-content": {
          padding: "16px",
          minHeight: "400px",
        },
        ".cm-focused": {
          outline: "none",
        },
        ".cm-editor": {
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        },
      }),
    ],
  });
};
```

**2. Real-time Code Compilation System**

```typescript
// From CodingPage.tsx - Live code execution
const handleCompileAndRun = useCallback(async () => {
  setOutput("Compiling and running...");

  try {
    const response = await fetch("/api/compile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, code }),
    });

    const data = await response.json();
    setOutput(data.output || "Error: " + data.error);
  } catch (error) {
    console.error("Error compiling and running code:", error);
    setOutput("Error compiling and running code. Please try again.");
  }
}, [language, code]);
```

**3. Advanced Code Formatting Integration**

```typescript
const handleFormat = useCallback(async () => {
  try {
    const formattedCode = await formatCode(code, language);

    if (editorViewRef.current) {
      const transaction = editorViewRef.current.state.update({
        changes: {
          from: 0,
          to: editorViewRef.current.state.doc.length,
          insert: formattedCode,
        },
      });
      editorViewRef.current.dispatch(transaction);
    }

    setCode(formattedCode);
    toast({
      title: "Code Formatted",
      description: "Your code has been formatted successfully.",
    });
  } catch (error) {
    console.error("Error formatting code:", error);
    toast({
      title: "Formatting Error",
      description: "Failed to format code. Please check syntax.",
      variant: "destructive",
    });
  }
}, [code, language]);
```

### 🤖 Advanced AI Integration Patterns

#### Google Gemini AI Implementation with Error Handling

**1. Resume Processing with File Upload**

```typescript
// From GeminiAIModal.ts - File processing and AI analysis
export async function sendInterviewRequest(formData: {
  jobPosition: string;
  jobDescription: string;
  yearsOfExperience: number;
  resume: File | null;
  resumeText: string;
}) {
  let fileUri = null;

  if (formData.resume) {
    // Convert File to ArrayBuffer then Buffer
    const arrayBuffer = await formData.resume.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Gemini File Manager
    const uploadResult = await fileManager.uploadContent(buffer, {
      mimeType: "application/pdf",
      displayName: formData.resume.name,
    });

    fileUri = uploadResult.file.uri;
  }

  const chatSession = model.startChat({
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    },
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
            : {
                text: `Resume Content: ${formData.resumeText}`,
              },
          {
            text: `Generate interview questions for:
            Position: ${formData.jobPosition}
            Description: ${formData.jobDescription}
            Experience: ${formData.yearsOfExperience} years`,
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(
    "Generate 5 comprehensive interview questions"
  );
  return result.response.text();
}
```

**2. Advanced Feedback Generation with Structured Responses**

````typescript
// From coding-questions-feedback API - Multi-dimensional analysis
const generateCodeFeedback = async (
  question: string,
  code: string,
  explanation?: string
) => {
  const prompt = `
    You are an expert coding interviewer. Analyze this solution:
    
    Question: ${question}
    Code Solution: ${code}
    ${explanation ? `Explanation: ${explanation}` : ""}
    
    Provide detailed feedback in this JSON format:
    {
      "rating": <1-10>,
      "technicalAccuracy": <1-10>,
      "codeQuality": <1-10>,
      "feedback": {
        "strengths": ["strength1", "strength2"],
        "improvements": ["improvement1", "improvement2"],
        "complexityAnalysis": "Time: O(n), Space: O(1)",
        "bestPractices": ["practice1", "practice2"]
      }
    }
  `;

  const chatSession = model.startChat({
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 32,
      maxOutputTokens: 4096,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  });

  const result = await chatSession.sendMessage(prompt);
  const responseText = await result.response.text();

  // Parse and validate response
  const filtered = responseText.replace("```json", "").replace("```", "");
  const parsedFeedback = JSON.parse(filtered);

  // Validation and normalization
  if (!validateFeedbackResponse(parsedFeedback)) {
    throw new Error("Invalid feedback response structure");
  }

  return parsedFeedback;
};
````

### ⚡ Performance Optimization Strategies

#### 1. Advanced State Management Patterns

```typescript
// Optimized state updates with useCallback and useMemo
const memoizedQuestions = useMemo(() => {
  return codingInterviewQuestions.map((question, index) => ({
    ...question,
    isActive: index === activeQuestionIndex,
  }));
}, [codingInterviewQuestions, activeQuestionIndex]);

const handleQuestionChange = useCallback(
  (newIndex: number) => {
    setActiveQuestionIndex(newIndex);
    // Reset related state
    setCode(getInitialCode(language));
    setOutput("");
    setFeedback(null);
  },
  [language]
);
```

#### 2. Efficient Database Connection Pooling

```typescript
// From db.ts - Optimized database configuration
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL!, {
  // Connection pooling configuration
  connectionString: process.env.NEXT_PUBLIC_DRIZZLE_DB_URL!,
  ssl: true,
  // Additional optimization options
});

export const db = drizzle(sql, {
  logger: process.env.NODE_ENV === "development",
});
```

#### 3. Edge Runtime Optimization for APIs

```typescript
// From API routes - Edge runtime configuration
export const runtime = "edge";

// Optimized API handler with caching
export async function POST(request: NextRequest) {
  try {
    // Request validation
    const body = await request.json();

    // Response caching headers
    const response = NextResponse.json(result);
    response.headers.set("Cache-Control", "public, s-maxage=60");

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## 🎨 UI Components Deep Dive

### Advanced Component Architecture

**1. Interview Components**

- `QuestionSection`: Displays interview questions with progress tracking
- `RecordAnswer`: Complete voice recording interface with real-time transcription
- `AddNewInterview`: Multi-step interview creation with resume upload

**2. Coding Components**

- `CodeEditor`: Feature-rich editor with CodeMirror 6 integration
- `CodingQuestion`: Interactive problem statement with examples
- `InterviewTimer`: Session timing with automatic submission
- `FloatingWebcam`: Picture-in-picture video with speech recognition

**3. Shared Components**

- Radix UI primitives with custom styling
- Responsive layouts with Tailwind CSS
- Framer Motion animations for smooth UX

### 🔄 Real-time Data Flow Implementation

#### 1. Interview Session Management

```typescript
// From StartInterview.tsx - Complete session management
const StartInterview = ({ params }: Props) => {
  const { interviewId } = React.use(params);
  const [interviewData, setInterviewData] = useState<any>(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState<
    InterviewQuestion[]
  >([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInterviewData = useCallback(async () => {
    if (!interviewId) {
      setError("No interview ID provided");
      setIsLoading(false);
      return;
    }

    try {
      const result = await db
        .select()
        .from(MOCKInterview)
        .where(eq(MOCKInterview.mockId, interviewId));

      if (result.length > 0) {
        const interviewData = result[0];
        try {
          const jsonMockQuestions = JSON.parse(interviewData.jsonMockResp);

          if (
            Array.isArray(jsonMockQuestions) &&
            jsonMockQuestions.length > 0
          ) {
            setInterviewData(interviewData);
            setMockInterviewQuestions(jsonMockQuestions);
          } else {
            setError("No valid questions found in the interview data");
          }
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          setError("Error parsing interview questions data");
        }
      } else {
        setError("No interview data found");
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
      setError("Error fetching interview details");
    } finally {
      setIsLoading(false);
    }
  }, [interviewId]);

  useEffect(() => {
    fetchInterviewData();
  }, [fetchInterviewData]);
};
```

#### 2. Real-time Code Compilation with Piston API

```typescript
// From compile API route - Production code execution service
import { NextResponse } from "next/server";

const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

export async function POST(request: Request) {
  const { language, code } = await request.json();

  // Language mapping for Piston API
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
```

#### 3. Advanced Feedback Processing Pipeline

````typescript
// From generate-feedback API - Intelligent response analysis
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer } = body;

    if (!question?.trim() || !answer?.trim()) {
      return NextResponse.json(
        { error: "Question and answer are required and cannot be empty" },
        { status: 400 }
      );
    }

    const chatSession = model.startChat({
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 32,
        maxOutputTokens: 4096,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const prompt = `
      You are an expert interview coach. Analyze this response:
      
      Question: ${question}
      Answer: ${answer}
      
      Provide structured feedback in JSON format:
      {
        "rating": <number between 1-10>,
        "feedback": "<constructive feedback with specific improvement suggestions>"
      }
      
      Focus on:
      1. Relevance to the question
      2. Technical accuracy (if applicable)
      3. Communication clarity
      4. Depth of understanding
      5. Areas for improvement
    `;

    const result = await chatSession.sendMessage(prompt);
    const responseText = await result.response.text();

    // Parse and validate response
    let parsedFeedback;
    try {
      const filtered = responseText.replace("```json", "").replace("```", "");
      parsedFeedback = JSON.parse(filtered);

      // Validate and sanitize the rating
      if (
        typeof parsedFeedback.rating !== "number" ||
        parsedFeedback.rating < 1 ||
        parsedFeedback.rating > 10
      ) {
        parsedFeedback.rating = 5; // Default rating if invalid
      }

      // Validate feedback text
      if (
        typeof parsedFeedback.feedback !== "string" ||
        !parsedFeedback.feedback.trim()
      ) {
        throw new Error("Invalid feedback text");
      }
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError);

      // Fallback feedback
      const fallbackFeedback = {
        rating: 5,
        feedback:
          "We encountered an error processing the feedback. Please try again.",
      };

      return NextResponse.json({
        feedback: fallbackFeedback,
        error: "Failed to parse AI response",
        metadata: {
          generatedAt: new Date().toISOString(),
          error: true,
        },
      });
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
````

### 🎯 Authentication & Security Implementation

#### 1. Clerk Authentication Setup

```typescript
// From layout.tsx - Root authentication provider
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

#### 2. Advanced Middleware Protection

```typescript
// From middleware.ts - Route-based access control
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/forum(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
```

#### 3. Input Sanitization and Validation

```typescript
// From coding-questions-feedback API - Security patterns
interface FeedbackRequest {
  question: string;
  code: string;
  explanation?: string;
}

// Utility function to sanitize input text
function sanitizeInput(text: string): string {
  return text.replace(/[^\w\s.,(){}[\]<>+=\-*/%&|^!?:;@#$'"`~/\\]/g, "").trim();
}

// Validate request structure
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
```

### 📱 Responsive Design Implementation

#### 1. Mobile-First Component Design

```typescript
// From CodingPage.tsx - Responsive layout implementation
return (
  <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
    {/* Question Panel - Responsive */}
    <div className="w-full lg:w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
      <CodingQuestion
        question={codingInterviewQuestions[activeQuestionIndex]}
        questionIndex={activeQuestionIndex}
        totalQuestions={codingInterviewQuestions.length}
        onQuestionChange={setActiveQuestionIndex}
      />
    </div>

    {/* Code Editor Panel - Responsive */}
    <div className="flex-1 flex flex-col">
      {/* Header - Mobile optimized */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-white border-b border-gray-200 gap-2">
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Responsive button group */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={handleFormat} variant="outline" size="sm">
            <FileCode className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Format</span>
          </Button>

          <Button onClick={handleCompileAndRun} variant="outline" size="sm">
            <Play className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Run</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
);
```

#### 2. Adaptive UI Components

```typescript
// From FloatingWebcam.tsx - Responsive video component
return (
  <div className="fixed z-50 bottom-4 right-4 bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="relative">
      <Webcam
        ref={webcamRef}
        mirrored={true}
        className="w-64 h-48 sm:w-80 sm:h-60 object-cover"
      />

      {/* Responsive controls */}
      <div className="absolute top-2 right-2 flex gap-1">
        <Button onClick={onClose} variant="outline" size="sm">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>

    {/* Responsive recording controls */}
    <div className="p-2 bg-gray-50 flex justify-between items-center">
      <Button
        onClick={toggleRecording}
        variant={isRecording ? "destructive" : "default"}
        size="sm"
        className="flex items-center gap-2"
      >
        {isRecording ? (
          <>
            <StopCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Stop</span>
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">Record</span>
          </>
        )}
      </Button>
    </div>
  </div>
);
```

### 🔧 Advanced Error Handling Patterns

#### 1. Comprehensive Error Boundaries

```typescript
// Error handling in components with graceful fallbacks
const [error, setError] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchInterviewData();

      if (!data || data.length === 0) {
        throw new Error("No data found");
      }

      setInterviewData(data);
    } catch (error) {
      console.error("Error loading data:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  loadData();
}, []);

// Render with error states
if (isLoading) {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="ml-2">Loading...</span>
    </div>
  );
}

if (error) {
  return (
    <div className="text-center text-red-500 p-8">
      <h3 className="text-lg font-semibold">Error Loading Data</h3>
      <p className="text-sm mt-2">{error}</p>
      <Button onClick={() => window.location.reload()} className="mt-4">
        Try Again
      </Button>
    </div>
  );
}
```

#### 2. API Error Handling with Retry Logic

```typescript
// From API utilities - Robust error handling
const apiCall = async (
  url: string,
  options: RequestInit,
  retries = 3
): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        if (response.status >= 500 && i < retries - 1) {
          // Retry on server errors
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
          continue;
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

## 🔒 Security Features

- **Authentication**: Secure user management with Clerk
- **Route Protection**: Middleware-based access control
- **Input Sanitization**: XSS and injection prevention
- **API Security**: Rate limiting and validation
- **Data Privacy**: Encrypted data transmission
- **Content Security**: AI response filtering

## 📊 Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js built-in optimization
- **Edge Runtime**: Faster API responses
- **Database Indexing**: Optimized query performance
- **Caching**: Strategic response caching
- **Bundle Analysis**: Minimized bundle sizes

## 🚀 Deployment

### Recommended Stack

- **Hosting**: Vercel (optimal for Next.js)
- **Database**: Neon PostgreSQL (serverless)
- **CDN**: Vercel Edge Network
- **Domain**: Custom domain with SSL

### Deploy to Vercel

1. **Connect repository to Vercel**
2. **Configure environment variables**
3. **Deploy automatically on push to main**

```bash
# Build command
npm run build

# Start command
npm start

# Development command
npm run dev
```

### Production Environment

```env
NODE_ENV=production
NEXT_PUBLIC_DRIZZLE_DB_URL=postgresql://prod_connection
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
GEMINI_API_KEY=AIza...
```

## 📈 Monitoring & Analytics

- **Performance Metrics**: Response times and throughput
- **User Analytics**: Engagement and completion rates
- **Error Tracking**: Comprehensive error logging
- **Database Monitoring**: Query performance analysis
- **AI Usage**: Token consumption and response quality

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write comprehensive tests for new features
- Document API changes and new components
- Ensure responsive design compatibility

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:push      # Push schema changes
npm run db:studio    # Open database studio

# Utilities
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier
```

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Google AI Documentation](https://ai.google.dev/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: [Shivam Prajapati](https://github.com/Prajapatishivam65)
- **Repository**: [Intelli-Mind](https://github.com/Prajapatishivam65/Intelli-Mind)

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Prajapatishivam65/Intelli-Mind/issues) section
2. Create a new issue with detailed description
3. Join our community discussions
4. Contact the development team

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and AI**

[⭐ Star this repository](https://github.com/Prajapatishivam65/Intelli-Mind) if you find it helpful!

</div>
