import React, { useState } from 'react';
// components
import QuestionCard from 'components/QuestionCard';
// services
import {fetchQuizQuestions} from 'services';
// types
import {Difficulty, QuestionState} from 'services';
// styles
import { GlobalStyle, Wrapper } from 'App.style';

export type AnswerObject = {
  question: string,
  answer: string,
  correct: boolean,
  correctAnswer: string
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const TOTAL_QUESTION = 10;

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTION,
      Difficulty.EASY
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      //users answer
      const answer = e.currentTarget.value
      // check answer against correct answer
      const correct = questions[number].correct_answer === answer;
      // add score if answer is correct
      if (correct) setScore(prev => prev + 1);
      const answerObject: AnswerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      };
      setUserAnswers(prev => [...prev, answerObject]);
    }
  }

  const nextQuestion = () => {
    // move on to the next question if not the last question
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTION) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  }


  return (
    // <GlobalStyle>
    //   <Wrapper>
        <div className="App">
          <h1>REACT QUIZ</h1>
            {(gameOver || userAnswers.length === TOTAL_QUESTION )
            && (<button className="start" onClick={startTrivia}>
                Start
              </button>)}
            {!gameOver && <p className="score">Score:</p>}
            {!gameOver && <p className="score">Score : {score}</p>}
            {loading && <p>Loading Questions...</p>}
            {(!loading && !gameOver) && (
              <QuestionCard 
                questionNumber={number+1}
                totalQuestions={TOTAL_QUESTION}
                question={questions[number].question}
                answers={questions[number].answer}
                userAnswer={userAnswers ? userAnswers[number] : undefined}
                callback={checkAnswer}
              />
            )}
            {(!gameOver 
              && !loading 
              && userAnswers.length === number + 1 
              && number !== TOTAL_QUESTION)
            && (<button className="next" onClick={nextQuestion}>
                  Next Question
                </button>
            )}
        </div>
    //   </Wrapper>
    // </GlobalStyle>
  );
}

export default App;