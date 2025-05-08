import { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";
import { getFocusFeedback } from "../../openai";

const DailySummary = () => {
  const [topTask, setTopTask] = useState(null);
  const [habitReminder, setHabitReminder] = useState(null);
  const [focusTip, setFocusTip] = useState("");

  useEffect(() => {
    // Get top task (highest priority)
    const taskQuery = query(
      collection(db, `users/${auth.currentUser.uid}/tasks`),
      orderBy("priority", "desc"),
      limit(1)
    );
    const taskUnsubscribe = onSnapshot(taskQuery, (snapshot) => {
      const task = snapshot.docs[0]?.data();
      setTopTask(task);
    });

    // Get a habit due today
    const habitQuery = query(
      collection(db, `users/${auth.currentUser.uid}/habits`),
      where("frequency", "==", "daily"),
      limit(1)
    );
    const habitUnsubscribe = onSnapshot(habitQuery, (snapshot) => {
      const habit = snapshot.docs[0]?.data();
      setHabitReminder(habit);
    });

    // Get focus tip
    getFocusFeedback(3).then(setFocusTip); // Default rating for demo

    return () => {
      taskUnsubscribe();
      habitUnsubscribe();
    };
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold">Daily Summary</h2>
      {topTask && (
        <div className="mt-4">
          <h3 className="font-semibold">Most Important Task</h3>
          <p>{topTask.title} ({topTask.label})</p>
        </div>
      )}
      {habitReminder && (
        <div className="mt-4">
          <h3 className="font-semibold">Habit Reminder</h3>
          <p>Don't forget to: {habitReminder.name}</p>
        </div>
      )}
      <div className="mt-4">
        <h3 className="font-semibold">Focus Tip</h3>
        <p>{focusTip}</p>
      </div>
    </div>
  );
};

export default DailySummary;