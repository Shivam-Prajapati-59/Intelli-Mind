"use client";
import { useState } from "react";
import Webcam from "react-webcam";
import { Camera, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

interface InterviewDetails {
  id: number;
  interviewId: string;
  interviewTopic: string;
  difficultyLevel: string;
  problemDescription: string;
  timeLimit: string;
  programmingLanguage: string;
  createdBy: string;
  createdAt: Date;
}

type Props = {
  interviewDetails: InterviewDetails;
};

export default function CodingInterviewClient({ interviewDetails }: Props) {
  const [webCamEnabled, setWebcamEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<
    "prompt" | "denied" | "granted"
  >("prompt");

  const handleCameraEnable = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      stream.getTracks().forEach((track) => track.stop());
      setWebcamEnabled(true);
      setPermissionStatus("granted");
    } catch (error) {
      setPermissionStatus("denied");
      setWebcamEnabled(false);
    }
  };

  const renderCameraSection = () => {
    if (webCamEnabled) {
      return (
        <div className="relative w-full h-full">
          <Webcam
            audio={true}
            mirrored={true}
            onUserMedia={() => setPermissionStatus("granted")}
            onUserMediaError={() => {
              setWebcamEnabled(false);
              setPermissionStatus("denied");
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
      );
    }

    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <Camera className="h-16 w-16 md:h-24 md:w-24 text-gray-400" />
        {permissionStatus === "denied" && (
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Permission Required</AlertTitle>
            <AlertDescription>
              Please enable camera access in your browser settings to continue
              with the interview. Click the camera icon in your browser's
              address bar to update permissions.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

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
                  Interview Topic:{" "}
                </span>
                <span className="md:w-2/3">
                  {interviewDetails.interviewTopic}
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <span className="font-bold text-base md:text-lg md:w-1/3">
                  Difficulty Level:{" "}
                </span>
                <span className="md:w-2/3">
                  {interviewDetails.difficultyLevel}
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <span className="font-bold text-base md:text-lg md:w-1/3">
                  Time Limit:{" "}
                </span>
                <span className="md:w-2/3">
                  {interviewDetails.timeLimit} minutes
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <span className="font-bold text-base md:text-lg md:w-1/3">
                  Programming Language:{" "}
                </span>
                <span className="md:w-2/3">
                  {interviewDetails.programmingLanguage}
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <span className="font-bold text-base md:text-lg md:w-1/3">
                  Problem Description:{" "}
                </span>
                <span className="md:w-2/3 whitespace-pre-wrap">
                  {interviewDetails.problemDescription}
                </span>
              </div>
            </div>
          </Card>

          <Alert className="bg-amber-50 border-amber-200">
            <Info className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <AlertDescription className="text-amber-700 text-sm md:text-base">
              Enable Video Web Cam and Microphone to Start your AI Generated
              Coding Interview. You will be presented with a coding problem to
              solve. NOTE: We never record your video, Web cam access you can
              disable at any time if you want.
            </AlertDescription>
          </Alert>
        </div>

        {/* Right Column - Webcam and Controls */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
            {renderCameraSection()}
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button
              className="w-full max-w-md text-sm md:text-base"
              onClick={handleCameraEnable}
              disabled={webCamEnabled}
            >
              <Camera className="mr-2 h-4 w-4" />
              Enable Web Cam and Microphone
            </Button>

            <Link
              href={`/dashboard/codingInterview/${interviewDetails.interviewId}/codeditor`}
            >
              <Button
                className="w-full max-w-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm md:text-base"
                disabled={!webCamEnabled}
              >
                Start Coding Interview
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
