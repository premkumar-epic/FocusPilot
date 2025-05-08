import { useState } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

const HabitForm = ({ onHabitAdded }) => {
  const [habit, setHabit] = useState({ name: "", frequency: "daily" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, `users/${auth.currentUser.uid}/habits`), {
        ...habit,
        createdAt: new Date(),
        completions: [],
      });
      onHabitAdded();
      setHabit({ name: "", frequency: "daily" });
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded">
      <input
        type="text"
        placeholder="Habit Name"
        value={habit.name}
        onChange={(e) => setHabit({ ...habit, name: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />
      <select
        value={habit.frequency}
        onChange={(e) => setHabit({ ...habit, frequency: e.target.value })}
        className="w-full p-2 border rounded"
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Add Habit
      </button>
    </form>
  );
};

export default HabitForm;