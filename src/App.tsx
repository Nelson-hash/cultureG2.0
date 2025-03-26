import React, { useState, useEffect } from 'react';
import { generateQuestionSet, Question } from './services/questionService';
import { Trophy, DollarSign, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [totalPrize, setTotalPrize] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const newQuestions = await generateQuestionSet();
      setQuestions(newQuestions);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load questions', error);
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || isLoading) return;
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    setTimeout(() => {
      if (answerIndex === questions[currentQuestion].correct) {
        const newPrize = questions[currentQuestion].prize;
        setTotalPrize(prevPrize => prevPrize + newPrize);
        
        if (currentQuestion === questions.length - 1) {
          setGameOver(true);
        } else {
          setCurrentQuestion(prev => prev + 1);
        }
      } else {
        setGameOver(true);
      }
      setShowResult(false);
      setSelectedAnswer(null);
    }, 2000);
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setGameOver(false);
    setTotalPrize(0);
    setShowResult(false);
    loadQuestions();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-4">
        <div className="flex items-center text-white">
          <RefreshCw className="animate-spin mr-4" />
          <span>Loading questions...</span>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            {totalPrize > 0 ? (
              <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
            ) : (
              <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
            )}
          </div>
          <h2 className="text-2xl font-bold mb-4">
            {totalPrize > 0 ? 'Congratulations!' : 'Game Over!'}
          </h2>
          <p className="text-xl mb-6">
            You won: <span className="font-bold">${totalPrize}</span>
          </p>
          <button
            onClick={resetGame}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <DollarSign className="w-6 h-6 text-green-500 mr-2" />
            <span className="text-xl font-bold">${totalPrize}</span>
          </div>
          <div className="flex items-center">
            <HelpCircle className="w-6 h-6 text-blue-500" />
            <span className="ml-2">Question {currentQuestion + 1}/{questions.length}</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            {questions[currentQuestion].question}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {questions[currentQuestion].answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={`p-4 rounded-lg text-left transition-colors ${
                showResult
                  ? index === questions[currentQuestion].correct
                    ? 'bg-green-500 text-white'
                    : index === selectedAnswer
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100'
                  : 'bg-gray-100 hover:bg-blue-100'
              }`}
            >
              {String.fromCharCode(65 + index)}. {answer}
            </button>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Prize for this question: ${questions[currentQuestion].prize}
        </div>
      </div>
    </div>
  );
}

export default App;
