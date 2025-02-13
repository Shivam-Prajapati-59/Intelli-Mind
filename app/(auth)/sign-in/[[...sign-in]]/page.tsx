"use client";

import { SignIn } from "@clerk/nextjs";
import { Brain } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-800 mb-2">
            Intellimind
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-80">
          <div className="flex justify-center">
            <SignIn />
          </div>
        </div>
      </div>
    </div>
  );
}
