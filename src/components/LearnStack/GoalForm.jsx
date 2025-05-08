import { useState } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { breakDownLearningGoal } from "../../openai";

const GoalForm = ({ onGoalAdded }) => {
  const [goal, setGoal] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const phases = await breakDownLearningGoal(goal);
      await addDoc(collection(db, `users/${auth.currentUser.uid}/learningGoals`), {
        goal,
        phases: JSON.parse(phases),
      });
      onGoalAdded();
      setGoal("");
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded">
      <input
        type="text"
        placeholder="Learning Goal (e.g., Learn React)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Add Goal
      </button>
    </form>
  );
};

export default GoalForm;