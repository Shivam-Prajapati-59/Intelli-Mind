"use client";

import type React from "react";
import { useState } from "react";
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
import { Plus, Upload, X, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PDFToText from "react-pdftotext";
import { sendInterviewRequest } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { MOCKInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { log } from "node:console";
import { useRouter } from "next/navigation";

interface FormData {
  jobPosition: string;
  jobDescription: string;
  yearsOfExperience: number;
  resume: File | null;
}

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    jobPosition: "",
    jobDescription: "",
    yearsOfExperience: 0,
    resume: null,
  });
  const [fileError, setFileError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState<any[]>([]);
  const { user } = useUser();
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "yearsOfExperience" ? Number(value) : value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError("");

    if (file) {
      // Check file type
      if (file.type !== "application/pdf") {
        setFileError("Please upload a PDF document");
        return;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setFileError("File size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        resume: file,
      }));
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({
      ...prev,
      resume: null,
    }));
    setFileError("");
  };

  // In AddNewInterview.tsx, update the onSubmit function:
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiFormData = new FormData();
      apiFormData.append("jobPosition", formData.jobPosition);
      apiFormData.append("jobDescription", formData.jobDescription);
      apiFormData.append(
        "yearsOfExperience",
        formData.yearsOfExperience.toString()
      );

      const response = await fetch("/api/interview-questions", {
        method: "POST",
        body: apiFormData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate interview questions");
      }

      const data = await response.json();
      const MockJson = data.questions.replace("```json", "").replace("```", "");
      const MockData = JSON.parse(MockJson);
      setJsonResponse(MockJson);

      // Insert into database
      const result = await db
        .insert(MOCKInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJson, // Store as a JSON string
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

      // console.log("Database insert result:", result);

      setOpenDialog(false);
      router.push(`/dashboard/interview/${result[0].insertedId}`);
      setFormData({
        jobPosition: "",
        jobDescription: "",
        yearsOfExperience: 0,
        resume: null,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-6 w-4" />
          Add New
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md md:max-w-lg">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Tell Us More About Your Job Interview
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Add details about your job position/role, job description and
              years of experience
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <label htmlFor="jobPosition" className="text-sm font-medium">
                Job/Role Position
              </label>
              <Input
                id="jobPosition"
                name="jobPosition"
                value={formData.jobPosition}
                onChange={handleInputChange}
                placeholder="e.g. Senior Frontend Developer"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="jobDescription" className="text-sm font-medium">
                Job/Role Description / Tech Stack
              </label>
              <Textarea
                id="jobDescription"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                placeholder="Brief description of the role and required technologies..."
                className="h-24 resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="yearsOfExperience"
                className="text-sm font-medium"
              >
                Years of Experience
              </label>
              <Input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                min="0"
                max="50"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Upload Resume (PDF only)
              </label>
              <div className="mt-2">
                {!formData.resume ? (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="resume"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500" />
                        ) : (
                          <Upload className="h-8 w-8 text-gray-500 mb-2" />
                        )}
                        <p className="text-sm text-gray-500">
                          Click to upload your resume (PDF only)
                        </p>
                        <p className="text-xs text-gray-500">
                          Max file size: 5MB
                        </p>
                      </div>
                      <Input
                        id="resume"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf"
                        disabled={isLoading}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 border rounded-lg">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span className="flex-1 text-sm truncate">
                      {formData.resume.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={removeFile}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {fileError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{fileError}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Start Interview"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewInterview;
