"use client";

import type React from "react";
import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { db } from "@/utils/db";
import { CodingInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface FormData {
  interviewTopic: string;
  difficultyLevel: string;
  problemDescription: string;
  timeLimit: number;
  programmingLanguage: string;
}

const INITIAL_FORM_STATE: FormData = {
  interviewTopic: "",
  difficultyLevel: "",
  problemDescription: "",
  timeLimit: 30,
  programmingLanguage: "",
};

const TIME_LIMIT = 60000; // 60 seconds

const AddNewCodingInterview: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useUser();
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "timeLimit" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = useCallback((): boolean => {
    return (
      formData.interviewTopic.trim() !== "" &&
      formData.difficultyLevel !== "" &&
      formData.problemDescription.trim() !== "" &&
      formData.timeLimit >= 15 &&
      formData.timeLimit <= 180 &&
      formData.programmingLanguage !== ""
    );
  }, [formData]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    setIsLoading(true);
    setProgress(0);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIME_LIMIT);

    try {
      const formDataApi = new FormData();
      formDataApi.append("topic", formData.interviewTopic);

      const response = await fetch("/api/coding-questions", {
        method: "POST",
        body: formDataApi,
        signal: controller.signal,
        cache: "no-store",
        headers: {
          Connection: "keep-alive",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to generate questions: ${response.statusText}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      let result = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += new TextDecoder().decode(value);
          // Update progress
          setProgress((prev) => Math.min(prev + 20, 90));
        }
      }

      // Parse and clean the response
      const cleanJsonQuestion = result
        .replace(/```json\s*/i, "")
        .replace(/```\s*$/, "")
        .trim();

      const cleanJsonOutput = JSON.parse(cleanJsonQuestion);

      setProgress(95);

      // Save to database
      const dbResult = await db
        .insert(CodingInterview)
        .values({
          interviewId: uuidv4(),
          jsonCodeResp: JSON.stringify(cleanJsonOutput),
          interviewTopic: formData.interviewTopic.trim(),
          difficultyLevel: formData.difficultyLevel,
          problemDescription: formData.problemDescription.trim(),
          timeLimit: formData.timeLimit.toString(),
          programmingLanguage: formData.programmingLanguage,
          createdBy: user?.primaryEmailAddress?.emailAddress ?? "unknown",
          createdAt: new Date(),
        })
        .returning({ insertedId: CodingInterview.interviewId });

      setProgress(100);
      setOpenDialog(false);
      setFormData(INITIAL_FORM_STATE);
      router.push(`/dashboard/codingInterview/${dbResult[0].insertedId}`);
    } catch (error: any) {
      console.error("Error submitting form:", error);

      if (error.name === "AbortError") {
        alert(
          "Request timed out. The operation took longer than expected. Please try again."
        );
      } else {
        alert(`An error occurred: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-6 w-4" />
          Add New Coding Interview
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md md:max-w-lg">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Create a New Coding Interview
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Set up a coding interview by providing details about the problem,
              difficulty, and requirements.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <label htmlFor="interviewTopic" className="text-sm font-medium">
                Interview Topic
              </label>
              <Input
                id="interviewTopic"
                name="interviewTopic"
                value={formData.interviewTopic}
                onChange={handleInputChange}
                placeholder="e.g. Stack, Queue, Linked List, etc."
                className="w-full"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="difficultyLevel" className="text-sm font-medium">
                Difficulty Level
              </label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("difficultyLevel", value)
                }
                value={formData.difficultyLevel}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="problemDescription"
                className="text-sm font-medium"
              >
                Problem Description
              </label>
              <Textarea
                id="problemDescription"
                name="problemDescription"
                value={formData.problemDescription}
                onChange={handleInputChange}
                placeholder="Describe the coding problem or challenge..."
                className="h-24 resize-none"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="timeLimit" className="text-sm font-medium">
                Time Limit (minutes)
              </label>
              <Input
                id="timeLimit"
                name="timeLimit"
                type="number"
                min="15"
                max="180"
                value={formData.timeLimit}
                onChange={handleInputChange}
                className="w-full"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="programmingLanguage"
                className="text-sm font-medium"
              >
                Preferred Programming Language
              </label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("programmingLanguage", value)
                }
                value={formData.programmingLanguage}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading && progress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpenDialog(false);
                setFormData(INITIAL_FORM_STATE);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                "Create Coding Interview"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewCodingInterview;
