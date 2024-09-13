import React, { useState, useEffect } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "./Input";

const MIN_NUMBER = 1;
const MAX_NUMBER = 10;
const MAX_ATTEMPTS = 10;

const Game = () => {
  const [targetNumber, setTargetNumber] = useState(0);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(100); // Start with a score of 100
  const [highScore, setHighScore] = useState(0);
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  let baseUrl = useSelector((state) => state.auth.baseUrl);

  useEffect(() => {
    initializeGame();
    const storedHighScore = localStorage.getItem("highScore");
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
  }, []);

  const initializeGame = () => {
    setTargetNumber(generateRandomNumber());
    setGuess("");
    setScore(100); // Reset score to 100
    setAttempts(0);
    setMessage("Try to guess the number!");
    setGameOver(false);
    setShowConfetti(false);
  };

  const generateRandomNumber = () => {
    return (
      Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER
    );
  };

  const saveScore = async (score) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${baseUrl}/score/save`,
        { currentScore: score },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Display success toast
        toast.success("Score saved successfully!");
      }
    } catch (error) {
      // Display error toast
      toast.error("Error saving score!");
    }
  };

  const handleGuess = () => {
    const guessNumber = parseInt(guess, 10);
    if (
      isNaN(guessNumber) ||
      guessNumber < MIN_NUMBER ||
      guessNumber > MAX_NUMBER
    ) {
      setMessage(
        `Please enter a valid number between ${MIN_NUMBER} and ${MAX_NUMBER}.`
      );
      return;
    }

    setAttempts((prev) => prev + 1);
    const remainingAttempts = MAX_ATTEMPTS - attempts - 1;

    if (guessNumber === targetNumber) {
      setMessage("Correct! You guessed the number!");
      setShowConfetti(true);

      // Save the current score to the backend
      saveScore(score);

      // Hide confetti after 5 seconds
      setTimeout(() => setShowConfetti(false), 5000);

      // Only update the high score if the current score is higher
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("highScore", score.toString());
      }
      setGameOver(true);
    } else {
      let newScore = score - 10;
      if (remainingAttempts === 0) {
        setMessage(`Game over! The number was ${targetNumber}.`);
        setGameOver(true);
      } else if (guessNumber < targetNumber) {
        setMessage(`Too low! ${remainingAttempts} attempts remaining.`);
        setScore(newScore);
      } else {
        setMessage(`Too high! ${remainingAttempts} attempts remaining.`);
        setScore(newScore);
      }
    }

    setGuess("");
  };

  return (
    <div className="container">
      <ToastContainer />
      <h1>🎉 Number Guessing Game 🎉</h1>
      <p>
        Guess the number between {MIN_NUMBER} and {MAX_NUMBER}
      </p>

      <div className="score-container">
        <p>Current Score: {score}</p>
        <p>High Score: {highScore}</p>
        <p>
          Attempts: {attempts}/{MAX_ATTEMPTS}
        </p>
      </div>

      <Input
        type="number"
        value={guess}
        setType={setGuess}
        className=""
        placeholder="Enter your guess"
      />

      <button className="btn" onClick={handleGuess} disabled={gameOver}>
        Submit Guess
      </button>
      <p className="message">{message}</p>

      {gameOver && (
        <>
          <button className="btn" onClick={initializeGame}>
            Play Again
          </button>
          {showConfetti && (
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          )}
        </>
      )}
    </div>
  );
};

export default Game;
