import { timestamp } from "drizzle-orm/pg-core";
import { serial, varchar, text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const MOCKInterview = pgTable("mock_interview", {
  id: serial("id").primaryKey(),
  jsonMockResp: text("jsonMockResp").notNull(),
  jobPosition: varchar("jobPosition").notNull(),
  jobDescription: varchar("jobDescription").notNull(),
  jobExperience: varchar("jobExperience").notNull(),
  fileData: text("file_data"),
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt").notNull(),
  mockId: varchar("mockId").notNull(),
});

export const UserAnswer = pgTable("userAnswer", {
  id: serial("id").primaryKey(),
  mockIdRef: varchar("mockId").notNull(),
  question: varchar("question").notNull(),
  correctAnswer: text("correctAnswer").notNull(),
  UserAns: text("UserAns").notNull(),
  feedback: varchar("feedback").notNull(),
  rating: varchar("rating").notNull(),
  userEmail: varchar("userEmail").notNull(),
  createdAt: varchar("createdAt").notNull(),
});

export const CodingInterview = pgTable("coding_interview", {
  id: serial("id").primaryKey(),
  jsonCodeResp: text("jsonCodeResp").notNull(),
  interviewId: varchar("interview_id").notNull().unique(),
  interviewTopic: varchar("interview_topic").notNull(),
  difficultyLevel: varchar("difficulty_level").notNull(),
  problemDescription: text("problem_description").notNull(),
  timeLimit: varchar("time_limit").notNull(),
  programmingLanguage: varchar("programming_language").notNull(),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const UserCodeAnswer = pgTable("userCodeAnswer", {
  id: serial("id").primaryKey(),
  interviewIdRef: varchar("interviewIdRef").notNull(),
  question: text("question").notNull(),
  correctAnswer: text("correctAnswer").notNull(),
  userAnswer: text("userAnswer").notNull(),
  feedback: text("feedback").notNull(),
  rating: varchar("rating").notNull(),
  userEmail: varchar("userEmail").notNull(),
  createdAt: timestamp("createdAt").notNull(),
  language: varchar("language").notNull(),
});
