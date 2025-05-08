import { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { getFocusFeedback } from "../../openai";

const Timer = () => {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [focusRating, setFocusRating] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let interval;
    if (isActive && time > 0) {
      interval = setInterval(() => setTime((prev) => prev - 1), 1000);
    } else if (time === 0) {
      setIsActive(false);
      if (isWork) {
        setIsWork(false);
        setTime(5 * 60); // 5-minute break
      } else {
        setFocusRating(null); // Prompt rating
      }
    }
    return () => clearInterval(interval);
  }, [isActive, time, isWork]);

  const handleStartPause = () => setIsActive(!isActive);
  const handleReset = () => {
    setIsActive(false);
    setIsWork(true);
    setTime(25 * 60);
    setFocusRating(null);
    setFeedback("");
  };

  const handleRating = async (rating) => {
    setFocusRating(rating);
    
    // Fixed missing function call syntax
    const feedbackText = await getFocusFeedback(rating);
    
    const session = {
      startTime: new Date(),
      duration: isWork ? 25 : 5,
      focusRating: rating,
      feedback: feedbackText,
    };

    await addDoc(collection(db, `users/${auth.currentUser.uid}/focusSessions`), session);
    setFeedback(feedbackText);
    setIsWork(true);
    setTime(25 * 60);
  };

  return (
    <div className="p-4 bg-white shadow rounded text-center">
      <h2 className="text-xl font-bold">{isWork ? "Work Session" : "Break"}</h2>
      <div className="text-4xl my-4">
        {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
      </div>
      <div className="space-x-4">
        <button
          onClick={handleStartPause}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isActive ? "Pause" : "Start"}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Reset
        </button>
      </div>
      {focusRating === null && !isActive && !isWork && (
        <div className="mt-4">
          <p>Rate your focus (1–5):</p>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className="text-yellow-500 text-2xl"
              >
                ★
              </button>
            ))}
          </div>
        </div>
      )}
      {feedback && <p className="mt-4">{feedback}</p>}
    </div>
  );
};

export default Timer;
