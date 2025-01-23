import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);

    useEffect(() => {
        fetch('assets/Questions.json')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setQuestions(data);
            })
            .catch((error) => {
                console.error('Fel vid hämtning av frågor:', error);
                setHasError(true);
            });
    }, []);


    useEffect(() => {
        if (hasError || !questions || questions.length === 0) {
            return;
        }

        const currentQuestion = questions[currentIndex];
        setTimeLeft(10);

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    handleTimeUp();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentIndex, questions, hasError]);

    const handleAnswerSelection = (option) => {
        setSelectedAnswer(option);
        setCorrectAnswer(currentQuestion.correctAnswer);

        if (option === currentQuestion.correctAnswer) {
            setScore((prevScore) => prevScore + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setCorrectAnswer(null);
        } else {
            setQuizComplete(true);
        }
    };

    const handleTimeUp = () => {
        setCorrectAnswer(currentQuestion.correctAnswer);
        setTimeout(() => {
            handleNextQuestion();
        }, 2000);
    };

    const handleRestartQuiz = () => {
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setCorrectAnswer(null);
        setScore(0);
        setQuizComplete(false);
    };

    const currentQuestion = questions[currentIndex];

    return (
        <div className="container">
            {quizComplete ? (
                <div className="summary">
                    <h2>Sammanfattning</h2>
                    <p>Du svarade rätt på {score} av {questions.length} frågor.</p>
                    <button onClick={handleRestartQuiz}>Starta om quizzet</button>
                </div>
            ) : hasError ? (
                <div className="error">Kunde inte ladda frågorna. Försök igen senare!</div>
            ) : questions.length === 0 ? (
                <div className="loading">Laddar frågor...</div>
            ) : (
                <>
                    <div className='header'>
                        <h1>Classic Rock Quiz</h1>
                        <div className="timer">
                            Tid kvar: {timeLeft} sekunder
                        </div>
                    </div>
                    <hr />
                    <h2>{currentQuestion.question}</h2>
                    <ul>
                        {currentQuestion.options.map((option, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => handleAnswerSelection(option)}
                                    className={`option ${
                                        selectedAnswer === option
                                            ? selectedAnswer === currentQuestion.correctAnswer
                                                ? 'correct'
                                                : 'incorrect'
                                            : correctAnswer === option
                                            ? 'correct'
                                            : ''
                                    }`}
                                    disabled={selectedAnswer !== null}
                                >
                                    {option}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={handleNextQuestion}
                        className={`next-button ${selectedAnswer === null ? 'disabled' : ''}`}
                        disabled={selectedAnswer === null}
                    >
                        {currentIndex < questions.length - 1 ? 'Nästa fråga' : 'Visa sammanfattning'}
                    </button>
                    <div className="index">
                        {currentIndex + 1} av {questions.length} frågor
                    </div>
                    {correctAnswer && (
                        <div className="correct-answer">
                            Rätt svar: {correctAnswer}
                        </div>
                    )}
                </>
            )}
        </div>
    );    
};

export default Quiz;
