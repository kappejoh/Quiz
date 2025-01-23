import React, { useState } from 'react';
import Quiz from './Components/Quiz/Quiz';
import './App.css';

const App = () => {
    const [quizStarted, setQuizStarted] = useState(false);

    const handleStartQuiz = () => {
        setQuizStarted(true);
    };

    return (
        <div>
            {quizStarted ? (
                <Quiz />
            ) : (
                <div className="welcome-container">
                    <h1>Välkommen till <br></br> Kappes Klassiska Rock<br></br> Quiz!</h1>
                    <button onClick={handleStartQuiz} className="start-quiz-button">
                        Starta Quizzet
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;
