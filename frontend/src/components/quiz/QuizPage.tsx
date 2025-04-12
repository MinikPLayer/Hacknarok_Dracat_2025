import React, { useState } from 'react';

type Question = {
  question: string;
  answers: string[];
  correct: number; // index poprawnej odpowiedzi
};

const questions: Question[] = [
  {
    question: "Jakiego kraju stolicą jest Oslo?",
    answers: ["Szwecja", "Norwegia", "Dania", "Finlandia"],
    correct: 1,
  },
  {
    question: "Który język programowania jest używany w React?",
    answers: ["Python", "Java", "JavaScript", "C#"],
    correct: 2,
  },
  {
    question: "Ile kontynentów jest na Ziemi?",
    answers: ["5", "6", "7", "8"],
    correct: 2,
  },
];

const QuizPage: React.FC = () => {
  const [current, setCurrent] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);

  const handleAnswer = () => {
    if (selected === null) return;

    if (selected === questions[current].correct) {
      setScore((prev) => prev + 1);
    }

    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="quiz-container">
        <h2>Koniec quizu!</h2>
        <p>Twój wynik: {score} / {questions.length}</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2>Pytanie {current + 1}:</h2>
      <p>{questions[current].question}</p>
      <ul>
        {questions[current].answers.map((answer, index) => (
          <li key={index}>
            <label>
              <input
                type="radio"
                name="answer"
                checked={selected === index}
                onChange={() => setSelected(index)}
              />
              {answer}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleAnswer} disabled={selected === null}>
        {current + 1 === questions.length ? 'Zakończ' : 'Dalej'}
      </button>
    </div>
  );
};

export default QuizPage;
