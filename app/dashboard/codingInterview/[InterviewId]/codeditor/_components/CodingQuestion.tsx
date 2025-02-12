import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Check, AlertTriangle } from "lucide-react";

interface Example {
  input: string[];
  output: number;
  explanation: string;
}

interface CodingInterviewQuestion {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  examples: Example[];
  constraints: string[];
  hints?: string[];
}

const CodingQuestion = ({
  question,
}: {
  question: CodingInterviewQuestion;
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-[900px] max-w-full mx-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold">{question.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="outline"
                className={getDifficultyColor(question.difficulty)}
              >
                {question.difficulty}
              </Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Array, Hash Table</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <Tabs defaultValue="description" className="space-y-4">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="hints">Hints</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-4">
            <Card>
              <CardContent className="pt-6 max-h-[300px] overflow-auto">
                <p className="text-gray-700 leading-relaxed">
                  {question.description}
                </p>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                Constraints
              </h2>
              <ul className="list-none space-y-2 max-h-48 overflow-auto">
                {question.constraints.map((constraint, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded"
                  >
                    <Check className="h-4 w-4 text-green-500" />
                    {constraint}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            {question.examples.map((example, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700"
                      >
                        Example {index + 1}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      <div className="bg-gray-50 p-3 rounded overflow-auto">
                        <p className="font-mono text-sm whitespace-pre-wrap break-words">
                          <span className="text-gray-500">Input: </span>
                          {JSON.stringify(example.input)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-mono text-sm">
                          <span className="text-gray-500">Output: </span>
                          {example.output}
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-gray-600 break-words">
                        <span className="font-medium">Explanation: </span>
                        {example.explanation}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="hints">
            <Card>
              <CardContent className="pt-6 max-h-[300px] overflow-auto">
                <ul className="space-y-3">
                  {question.hints?.map((hint, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg break-words"
                    >
                      <div className="mt-1">
                        <Info className="h-4 w-4 text-yellow-600" />
                      </div>
                      <p className="text-sm text-gray-700">{hint}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CodingQuestion;
