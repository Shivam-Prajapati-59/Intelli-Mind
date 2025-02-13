"use client";

import { motion } from "framer-motion";
import { Pacifico } from "next/font/google";
import {
  Code,
  Cpu,
  Brain,
  ChevronRight,
  Sparkles,
  Zap,
  Star,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { JSX } from "react";
import Link from "next/link";
import type React from "react"; // Added import for React

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

interface ElegantShapeProps {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: ElegantShapeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute hidden lg:block", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
          scale: [1, 1.02, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[3px] border border-white/[0.2]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.15)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_70%)]",
            "hover:border-white/[0.3] transition-all duration-500"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-[size:16px_28px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      />
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  delay: number;
  description: string;
}

function FeatureCard({
  icon: Icon,
  title,
  delay,
  description,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="group flex flex-col items-center p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] transition-all duration-300 hover:scale-105"
    >
      <div className="p-4 rounded-full bg-white/[0.05] group-hover:bg-white/[0.08] transition-colors duration-300 group-hover:scale-110">
        <Icon className="w-8 h-8 text-white/80 group-hover:text-white transition-colors duration-300" />
      </div>
      <span className="mt-4 text-white/90 font-medium text-lg">{title}</span>
      <p className="mt-2 text-white/50 text-sm text-center">{description}</p>
    </motion.div>
  );
}

function FloatingSparkle({
  delay,
  icon: Icon,
  className,
}: {
  delay: number;
  icon: React.ElementType;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 2 }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], y: -20 }}
      transition={{
        duration: 2,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 3,
      }}
      className={cn("absolute", className)}
    >
      <Icon className="w-6 h-6 text-blue-400/60" />
    </motion.div>
  );
}

export default function IntellimidLandingPage(): JSX.Element {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.08] via-transparent to-purple-500/[0.08] blur-3xl" />

      <GridBackground />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-blue-500/[0.2]"
          className="left-[-10%] lg:left-[-5%] top-[15%] lg:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-purple-500/[0.2]"
          className="right-[-5%] lg:right-[0%] top-[70%] lg:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-cyan-500/[0.2]"
          className="left-[5%] lg:left-[10%] bottom-[5%] lg:bottom-[10%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] mb-12 hover:bg-white/[0.08] transition-colors duration-300"
          >
            <Cpu className="w-5 h-5 text-white/70" />
            <span className="text-sm text-white/70 tracking-wider font-medium">
              Intellimid AI
            </span>
            <FloatingSparkle
              delay={0}
              icon={Sparkles}
              className="left-[-20px] top-[-20px]"
            />
            <FloatingSparkle
              delay={1.5}
              icon={Zap}
              className="right-[-20px] bottom-[-20px]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                Master Coding
              </span>
              <br />
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300",
                  pacifico.className
                )}
              >
                Ace Interviews
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-base sm:text-lg md:text-xl text-white/50 mb-12 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4">
              Elevate your coding skills and interview performance with
              AI-powered practice and personalized feedback.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex justify-center gap-4"
          >
            <Link href="./dashboard">
              <button className="group relative px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                Get Started
                <ChevronRight className="w-4 h-4 inline-block ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* <FloatingSparkle delay={2} icon={Star} className="left-[10%] top-[30%]" /> */}
      <FloatingSparkle
        delay={2.5}
        icon={Lightbulb}
        className="right-[10%] top-[40%]"
      />
      <FloatingSparkle
        delay={3}
        icon={Brain}
        className="left-[15%] bottom-[20%]"
      />
      <FloatingSparkle
        delay={3.5}
        icon={Code}
        className="right-[15%] bottom-[30%]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/90 pointer-events-none" />
    </div>
  );
}
