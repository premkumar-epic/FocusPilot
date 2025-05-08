import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

const GoalDetail = () => {
  const { id } = useParams();
  const [goal, setGoal] = useState(null);
  const [subTasks, setSubTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoal = async () => {
      const user = auth.currentUser;
      if (user) {
        const goalRef = doc(db, `users/${user.uid}/goals`, id);
        const goalSnap = await getDoc(goalRef);
        if (goalSnap.exists()) {
          const goalData = { id: goalSnap.id, ...goalSnap.data() };
          setGoal(goalData);

          // Generate sub-tasks based on the goal title
          const generatedSubTasks = generateSubTasks(goalData.title);
          setSubTasks(generatedSubTasks.map((task, index) => ({
            id: index,
            title: task,
            completed: false,
          })));
        }
        setLoading(false);
      }
    };
    fetchGoal();
  }, [id]);

  const generateSubTasks = (title) => {
    // Simple logic to break down goals into sub-tasks (can be enhanced with AI later)
    if (title.toLowerCase().includes("python")) {
      return [
        "Learn basic syntax and variables",
        "Understand loops and conditionals",
        "Work with functions and modules",
        "Complete a small project (e.g., calculator)",
        "Explore a Python library (e.g., Pandas)",
      ];
    } else if (title.toLowerCase().includes("guitar")) {
      return [
        "Learn basic chords (e.g., C, G, D)",
        "Practice strumming patterns",
        "Play a simple song",
        "Learn fingerpicking techniques",
        "Practice scales for 15 minutes daily",
      ];
    } else {
      return [
        "Research the topic for 1 hour",
        "Create a study schedule",
        "Complete an introductory tutorial",
        "Practice for 30 minutes daily",
        "Review progress and adjust goals",
      ];
    }
  };

  const handleToggleSubTask = async (subTaskId) => {
    const updatedSubTasks = subTasks.map((task) =>
      task.id === subTaskId ? { ...task, completed: !task.completed } : task
    );
    setSubTasks(updatedSubTasks);

    const completedTasks = updatedSubTasks.filter((task) => task.completed).length;
    const progress = Math.round((completedTasks / updatedSubTasks.length) * 100);

    const user = auth.currentUser;
    if (user) {
      const goalRef = doc(db, `users/${user.uid}/goals`, id);
      await updateDoc(goalRef, { progress });
    }
  };

  if (loading || !goal) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#2C3E50]"></div>
    </div>
  );

  const remainingTasks = subTasks.filter((task) => !task.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-[#2C3E50] mb-4 font-montserrat">{goal.title}</h2>
      <p className="text-[#7F8C8D] font-roboto"><strong>Objective:</strong> {goal.objectives}</p>
      <p className="text-[#7F8C8D] font-roboto"><strong>Reason:</strong> {goal.reason}</p>
      <div className="mt-4">
        <h3 className="text-lg font-medium text-[#3498DB] mb-2 font-montserrat">Progress</h3>
        <div className="w-full bg-[#7F8C8D] rounded-full h-2.5">
          <div
            className="bg-[#F39C12] h-2.5 rounded-full"
            style={{ width: `${goal.progress}%` }}
          ></div>
        </div>
        <p className="text-[#7F8C8D] text-sm font-roboto">{goal.progress}% Complete</p>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-medium text-[#3498DB] mb-2 font-montserrat">Sub-Tasks</h3>
        <div className="space-y-2">
          {subTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center p-2 bg-[#ECF0F1] rounded-lg"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleSubTask(task.id)}
                className="mr-2 h-5 w-5 text-[#F39C12] focus:ring-[#3498DB] border-[#7F8C8D] rounded"
              />
              <p
                className={`flex-1 text-[#2C3E50] font-roboto ${
                  task.completed ? "line-through text-[#7F8C8D]" : ""
                }`}
              >
                {task.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-medium text-[#3498DB] mb-2 font-montserrat">Path Ahead</h3>
        <p className="text-[#7F8C8D] font-roboto">
          {remainingTasks > 0
            ? `You have ${remainingTasks} sub-task${remainingTasks > 1 ? "s" : ""} remaining to complete this goal.`
            : "Congratulations! You've completed all sub-tasks for this goal!"}
        </p>
      </div>
    </motion.div>
  );
};

export default GoalDetail;