import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, Code, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <main className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <section className="text-center mb-20 md:mb-32">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 transition-all duration-300 hover:scale-105 leading-tight text-black dark:text-white">
            Welcome to{" "}
            <span className="text-gray-600 dark:text-gray-400">
              Intellimind
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-400 leading-relaxed">
            Elevate Your Interview Skills with AI-Powered Practice
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black hover:dark:bg-gray-200 transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="mr-2 h-5 w-5" /> Mock Interview Practice
              </Button>
            </Link>
            <Link href={"/code_dashboard"}>
              <Button
                size="lg"
                variant="outline"
                className="border-black text-black hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-900 transition-all duration-300 hover:scale-105"
              >
                <Code className="mr-2 h-5 w-5" /> Coding Interview Practice
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 md:mb-32">
          {[
            {
              icon: Zap,
              title: "AI-Powered Feedback",
              description:
                "Get instant, personalized feedback to improve your interview skills.",
            },
            {
              icon: Users,
              title: "Realistic Scenarios",
              description:
                "Practice with lifelike interview simulations across various industries.",
            },
            {
              icon: Code,
              title: "Coding Challenges",
              description:
                "Sharpen your coding skills with our interactive programming exercises.",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:scale-105 p-4 md:p-6 rounded-lg"
            >
              <CardContent className="pt-0">
                <div className="flex justify-center mb-4">
                  <feature.icon className="h-12 w-12 text-gray-600 dark:text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">
                  {feature.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Testimonial Section */}
        <section className="text-center mb-20 md:mb-32">
          <h2 className="text-3xl font-bold mb-8 transition-all duration-300 hover:scale-105 text-black dark:text-white">
            What Our Users Say
          </h2>
          <div className="flex justify-center">
            <Card className="max-w-lg bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-lg">
              <CardContent className="pt-6">
                <Avatar className="h-16 w-16 mx-auto mb-4 transition-all duration-300 hover:scale-110 border-2 border-gray-200 dark:border-gray-700">
                  <AvatarImage
                    src="/placeholder.svg?height=64&width=64"
                    alt="User"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  "Intellimind has been a game-changer for my interview
                  preparation. The AI feedback is incredibly helpful!"
                </p>
                <p className="font-semibold text-black dark:text-white">
                  Jane Doe, Software Engineer
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-900 py-8 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 Intellimind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
