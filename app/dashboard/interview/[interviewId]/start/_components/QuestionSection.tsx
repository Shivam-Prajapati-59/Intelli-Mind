import { Lightbulb, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type InterviewQuestion = {
  Question: string;
  Answer: string;
};

type Props = {
  mockInterviewQuestions: InterviewQuestion[];
  activeQuestionIndex: number;
};

function QuestionSection({
  mockInterviewQuestions,
  activeQuestionIndex,
}: Props) {
  const textToSpeech = (text: string) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support speech synthesis.");
    }
  };

  const currentQuestion = mockInterviewQuestions[activeQuestionIndex];

  console.log("Current question object:", currentQuestion);

  if (!currentQuestion) {
    return <div className="p-6 border-r h-full">No question available</div>;
  }

  return (
    <div className="p-6 border-r h-full">
      <div className="flex flex-wrap gap-3 mb-6">
        {mockInterviewQuestions.map((_, index) => (
          <div
            key={index}
            className={`p-2 rounded-full text-xs md:text-sm text-center w-10 h-10 flex items-center justify-center ${
              activeQuestionIndex === index
                ? "bg-primary text-white"
                : "bg-secondary text-primary"
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
      <h2 className="text-xl md:text-2xl font-semibold mb-6">
        Question {activeQuestionIndex + 1}:
      </h2>
      <p className="text-lg mb-4">{currentQuestion.Question}</p>
      <div className="flex gap-2 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => textToSpeech(currentQuestion.Question)}
        >
          <Volume2 size={16} className="mr-2" />
          Read Question
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.speechSynthesis.cancel()}
        >
          Stop Reading
        </Button>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
          <Lightbulb size={20} />
          Note :
        </h3>
        <p className="text-sm text-blue-600">
          Click on Record Answer when you want to answer the question. At the
          end of interview we will give you the feedback along with correct
          answer for each of question and your answer to comapre it.
        </p>
      </div>
    </div>
  );
}

export default QuestionSection;
