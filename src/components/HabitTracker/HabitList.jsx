import { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { suggestHabitTweaks } from "../../openai";

const HabitList = () => {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, `users/${auth.currentUser.uid}/habits`),
      (snapshot) => {
        const habitList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setHabits(habitList);
      }
    );
    return () => unsubscribe();
  }, []);

  const calculateStreak = (completions, frequency) => {
    // Logic to calculate streak based on completion timestamps
    return completions.length; // Simplified for brevity
  };

  const markDone = async (habitId, habit) => {
    const habitRef = doc(db, `users/${auth.currentUser.uid}/habits`, habitId);
    const newCompletions = [...habit.completions, new Date()];
    await updateDoc(habitRef, { completions: newCompletions });
    const tweak = await suggestHabitTweaks(habit, calculateStreak(newCompletions, habit.frequency));
    alert(tweak);
  };

  return (
    <div className="space-y-4 p-4">
      {habits.map((habit) => (
        <div key={habit.id} className="p-4 bg-white shadow rounded flex justify-between">
          <div>
            <h3 className="font-bold">{habit.name}</h3>
            <p>Frequency: {habit.frequency}</p>
            <p>Streak: {calculateStreak(habit.completions, habit.frequency)}</p>
          </div>
          <button
            onClick={() => markDone(habit.id, habit)}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Mark Done
          </button>
        </div>
      ))}
    </div>
  );
};

export default HabitList;