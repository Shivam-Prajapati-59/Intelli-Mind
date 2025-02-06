"use client";

import { SignIn } from "@clerk/nextjs";
import { Waves, Mic, User, Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="md:w-1/2 p-8 flex flex-col justify-center items-center text-center md:text-left">
        <div className="max-w-md">
          <div className="flex items-center justify-center md:justify-start mb-8">
            <Waves className="h-10 w-10 text-blue-600 mr-2" />
            <span className="text-2xl font-bold text-blue-600">
              InterviewAI
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Ace Your Next Interview
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Practice, learn, and improve with our AI-powered interview
            simulator.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <FeatureCard icon={Mic} title="Real-time Feedback" />
            <FeatureCard icon={User} title="Personalized Coaching" />
            <FeatureCard icon={Lightbulb} title="Industry Insights" />
            <FeatureCard icon={Waves} title="AI-Powered Analysis" />
          </div>
        </div>
      </div>
      <div className="md:w-1/2 p-8 flex justify-center items-center bg-white rounded-tl-3xl rounded-bl-3xl shadow-2xl">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Sign In to Get Started
          </h2>
          <SignIn afterSignInUrl="./dashboard" />
          <p className="mt-8 text-center text-sm text-gray-500">
            By signing in, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title }: any) {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
      <Icon className="h-6 w-6 text-blue-600 mr-3" />
      <span className="text-gray-800 font-medium">{title}</span>
    </div>
  );
}
