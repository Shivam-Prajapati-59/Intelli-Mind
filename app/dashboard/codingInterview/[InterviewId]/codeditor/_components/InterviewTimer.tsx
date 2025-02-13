"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface InterviewTimerProps {
  duration: number; // Duration in minutes
  onTimeUp: () => void;
}

const InterviewTimer: React.FC<InterviewTimerProps> = ({
  duration,
  onTimeUp,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((time) => time - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    const percentage = (timeLeft / (duration * 60)) * 100;
    if (percentage > 50) return "text-green-600";
    if (percentage > 25) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex items-center space-x-4">
      <div className={`text-2xl font-bold ${getTimerColor()}`}>
        {formatTime(timeLeft)}
      </div>
      {timeLeft <= 300 && (
        <AlertCircle className="text-red-600 animate-pulse" />
      )}
    </div>
  );
};

export default InterviewTimer;
