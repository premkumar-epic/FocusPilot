import { useState } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

const TaskForm = ({ onTaskAdded }) => {
  const [task, setTask] = useState({
    title: "",
    deadline: "",
    estimatedTime: "",
    difficulty: 1,
    energyLevel: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, `users/${auth.currentUser.uid}/tasks`), {
        ...task,
        deadline: new Date(task.deadline),
        estimatedTime: parseInt(task.estimatedTime),
      });
      onTaskAdded();
      setTask({ title: "", deadline: "", estimatedTime: "", difficulty: 1, energyLevel: 1 });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded">
      <input
        type="text"
        placeholder="Task Title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="datetime-local"
        value={task.deadline}
        onChange={(e) => setTask({ ...task, deadline: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Estimated Time (minutes)"
        value={task.estimatedTime}
        onChange={(e) => setTask({ ...task, estimatedTime: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />
      <select
        value={task.difficulty}
        onChange={(e) => setTask({ ...task, difficulty: parseInt(e.target.value) })}
        className="w-full p-2 border rounded"
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
      <select
        value={task.energyLevel}
        onChange={(e) => setTask({ ...task, energyLevel: parseInt(e.target.value) })}
        className="w-full p-2 border rounded"
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;