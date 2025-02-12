"use client";

import { motion, Variants } from "framer-motion";
import { JetBrains_Mono } from "next/font/google";
import { Code2, Brain, Cpu, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

interface FloatingIconProps {
  icon: LucideIcon;
  className?: string;
  delay?: number;
  size?: number;
}

interface HeroGeometricProps {
  title1?: string;
  title2?: string;
  description?: string;
}

function FloatingIcon({
  icon: Icon,
  className,
  delay = 0,
  size = 24,
}: FloatingIconProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 1,
        delay,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      className={cn(
        "absolute p-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10",
        "hover:bg-white/10 transition-colors duration-300",
        "shadow-lg shadow-black/10",
        className
      )}
    >
      <motion.div
        animate={{
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Icon size={size} className="text-white/80" />
      </motion.div>
    </motion.div>
  );
}

function MatrixBackground() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ duration: 2 }}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
    </motion.div>
  );
}

function CodeSnippet() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 1 }}
      className={cn(
        "absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block",
        "w-[400px] h-[300px] rounded-lg bg-black/40 backdrop-blur-xl",
        "border border-white/10 p-4 overflow-hidden",
        "shadow-2xl shadow-black/20",
        "hover:border-white/20 transition-colors duration-300",
        jetbrainsMono.className
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500/50" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
        <div className="w-3 h-3 rounded-full bg-green-500/50" />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <pre className="text-sm text-white/70">
          <span className="text-blue-400">async function</span>{" "}
          <span className="text-green-400">analyzeCode</span>(code: string){" "}
          {"{"}
          {"\n"} <span className="text-purple-400">const</span> result = await
          AI.analyze(code);
          {"\n"} <span className="text-blue-400">if</span> (result.complexity{" "}
          {">"} threshold) {"{"}
          {"\n"} <span className="text-purple-400">return</span>{" "}
          suggestOptimizations(code);
          {"\n"} {"}"}
          {"\n"} <span className="text-purple-400">return</span>{" "}
          result.feedback;
          {"\n"}
          {"}"}
        </pre>
      </motion.div>
    </motion.div>
  );
}

export default function HeroGeometric({
  title1 = "Master Coding",
  title2 = "With AI Intelligence",
  description = "Experience the future of technical interviews with our AI-powered platform. Practice, learn, and excel in your coding journey.",
}: HeroGeometricProps) {
  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A]">
      <MatrixBackground />

      <FloatingIcon icon={Code2} className="left-[15%] top-[20%]" delay={0.3} />
      <FloatingIcon
        icon={Brain}
        className="right-[25%] top-[30%]"
        delay={0.6}
      />
      <FloatingIcon
        icon={Cpu}
        className="left-[20%] bottom-[25%]"
        delay={0.9}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-transparent to-purple-500/[0.05] blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] mb-8 hover:bg-white/[0.08] transition-colors duration-300"
          >
            <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse" />
            <span className="text-xl text-white/70 tracking-wider font-medium">
              Intellimind
            </span>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                {title1}
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                {title2}
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-lg md:text-xl text-white/50 mb-8 leading-relaxed font-light tracking-wide max-w-2xl mx-auto">
              {description}
            </p>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center gap-4"
          >
            <button className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium transition-all duration-300 hover:scale-105">
              Start Practice
            </button>
            <button className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25">
              Try Demo
            </button>
          </motion.div>
        </div>
      </div>

      <CodeSnippet />

      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-[#0A0A0A]/80 pointer-events-none" />
    </div>
  );
}
