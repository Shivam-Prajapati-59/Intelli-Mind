"use client";

import { useState } from "react";
import Webcam from "react-webcam";
import { Camera, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

type InterviewDetails = {
  mockId: string;
  jobPosition: string;
  jobDescription: string;
  jobExperience: string;
  createdBy: string;
  createdAt: string;
};

type Props = {
  interviewDetails: InterviewDetails;
};

export default function InterviewClient({ interviewDetails }: Props) {
  const [webCamEnabled, setWebcamEnabled] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center lg:text-left">
        Let&apos;s Get Started
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column - Interview Details */}
        <div className="space-y-6">
          <Card className="p-4 md:p-6 shadow-lg bg-white">
            <div className="space-y-3 md:space-y-4">
              <div className="flex flex-col md:flex-row md:items-center">
                <span className="font-bold text-base md:text-lg md:w-1/3">
                  Job Role/Job Position:
                </span>
                <span className="md:w-2/3">{interviewDetails.jobPosition}</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <span className="font-bold text-base md:text-lg md:w-1/3">
                  Job Description/Tech Stack:
                </span>
                <span className="md:w-2/3">
                  {interviewDetails.jobDescription}
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <span className="font-bold text-base md:text-lg md:w-1/3">
                  Years of Experience:
                </span>
                <span className="md:w-2/3">
                  {interviewDetails.jobExperience}
                </span>
              </div>
            </div>
          </Card>

          {/* Information Alert */}
          <Alert className="bg-amber-50 border-amber-200">
            <Info className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <AlertDescription className="text-amber-700 text-sm md:text-base">
              Enable Video Web Cam and Microphone to Start your AI Generated
              Mock Interview. It Has 5 questions which you can answer and at the
              last you will get the report on the basis of your answer. NOTE: We
              never record your video, Web cam access you can disable at any
              time if you want.
            </AlertDescription>
          </Alert>
        </div>

        {/* Right Column - Webcam and Controls */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
            {webCamEnabled ? (
              <div className="relative w-full h-full">
                <Webcam
                  audio={true}
                  mirrored={true}
                  onUserMedia={() => console.log("Webcam enabled")}
                  onUserMediaError={() => {
                    setWebcamEnabled(false);
                    console.error("Webcam access denied");
                  }}
                  className="rounded-lg w-full h-full object-cover"
                />
                <Button
                  variant="destructive"
                  className="absolute top-2 right-2 md:top-4 md:right-4 text-xs md:text-sm"
                  onClick={() => setWebcamEnabled(false)}
                >
                  Disable Camera
                </Button>
              </div>
            ) : (
              <Camera className="h-16 w-16 md:h-24 md:w-24 text-gray-400" />
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-4">
            <Button
              className="w-full max-w-md text-sm md:text-base"
              onClick={() => setWebcamEnabled(true)}
              disabled={webCamEnabled}
            >
              <Camera className="mr-2 h-4 w-4" />
              Enable Web Cam and Microphone
            </Button>

            <Link
              href={`/dashboard/interview/${interviewDetails.mockId}/start`}
            >
              <Button
                className="w-full max-w-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm md:text-base"
                disabled={!webCamEnabled}
              >
                Start Interview
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
