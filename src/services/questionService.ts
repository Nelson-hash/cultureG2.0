export interface Question {
  question: string;
  answers: string[];
  correct: number;
  prize: number;
}

export async function generateQuestionSet(count: number = 5): Promise<Question[]> {
  try {
    const response = await fetch(`https://opentdb.com/api.php?amount=${count}&type=multiple`);
    const data = await response.json();

    const questions: Question[] = data.results.map((q: any, index: number) => {
      // Combine correct and incorrect answers
      const answers = [
        ...q.incorrect_answers, 
        q.correct_answer
      ];

      // Shuffle answers
      for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
      }

      // Find the index of the correct answer after shuffling
      const correctIndex = answers.indexOf(q.correct_answer);

      return {
        question: decodeURIComponent(q.question),
        answers: answers.map(ans => decodeURIComponent(ans)),
        correct: correctIndex,
        prize: calculatePrize(index)
      };
    });

    return questions;
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    return getFallbackQuestions();
  }
}

// Calculate prize based on question index
function calculatePrize(index: number): number {
  const prizes = [100, 200, 500, 1000, 2000];
  return prizes[Math.min(index, prizes.length - 1)];
}

// Fallback questions in case of API failure
function getFallbackQuestions(): Question[] {
  return [
    {
      question: "Which planet is known as the Red Planet?",
      answers: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: 1,
      prize: 100
    },
    {
      question: "What is the capital of France?",
      answers: ["London", "Berlin", "Paris", "Rome"],
      correct: 2,
      prize: 200
    },
    {
      question: "Who painted the Mona Lisa?",
      answers: ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"],
      correct: 2,
      prize: 500
    },
    {
      question: "What is the largest mammal in the world?",
      answers: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
      correct: 1,
      prize: 1000
    },
    {
      question: "Which element has the symbol 'O'?",
      answers: ["Gold", "Silver", "Oxygen", "Osmium"],
      correct: 2,
      prize: 2000
    }
  ];
}
