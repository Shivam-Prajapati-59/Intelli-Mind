"use client";

import { Button } from "@/components/ui/button";
import { Mic, Save, StopCircle, Trash2, X } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import Webcam from "react-webcam";

interface FloatingWebcamProps {
  onClose: () => void;
  onTranscriptChange: (transcript: string) => void;
}

export default function FloatingWebcam({
  onClose,
  onTranscriptChange,
}: FloatingWebcamProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording]);

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition is not supported in this browser.");
      return;
    }

    setIsRecording(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(" ");
      setTranscript(currentTranscript.trim());
      onTranscriptChange(currentTranscript.trim());
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const clearTranscript = () => {
    setTranscript("");
    onTranscriptChange("");
  };
  if (hasPermission === null) {
    return <div>Requesting camera permission...</div>;
  }

  if (hasPermission === false) {
    return (
      <div className="fixed z-50 bottom-4 right-4 bg-white rounded-lg shadow-lg overflow-hidden p-4">
        <p>Please allow camera access to use this feature.</p>
        <Button onClick={onClose} variant="outline" size="sm" className="mt-2">
          <X className="h-4 w-4 mr-2" />
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed z-50 bottom-4 right-4 bg-white rounded-lg shadow-lg overflow-hidden max-w-[300px]">
      <div className="relative">
        <Webcam
          audio={false}
          mirrored={true}
          className="rounded-t-lg w-full h-[225px] object-cover"
        />
        <div className="absolute top-2 right-2">
          <Button
            onClick={onClose}
            variant="outline"
            size="icon"
            className="bg-white bg-opacity-50 hover:bg-opacity-75"
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>
      <div className="p-2 flex justify-around bg-gray-100">
        <Button
          onClick={toggleRecording}
          variant={isRecording ? "destructive" : "default"}
          size="sm"
          className="flex items-center gap-2"
        >
          {isRecording ? (
            <>
              <StopCircle className="h-4 w-4" />
              Stop
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Record
            </>
          )}
        </Button>
      </div>
      {transcript && (
        <div className="p-2 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-2">
              <Button
                onClick={clearTranscript}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
