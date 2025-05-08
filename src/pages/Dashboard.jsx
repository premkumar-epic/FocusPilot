import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db, auth } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const quotes = [
  "The secret of getting ahead is getting started.",
  "You don’t have to be great to start, but you have to start to be great.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "The only way to do great work is to love what you do.",
  "Don’t watch the clock; do what it does. Keep going.",
];

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        // Fetch tasks
        const tasksRef = collection(db, `users/${user.uid}/tasks`);
        const unsubscribeTasks = onSnapshot(tasksRef, (snapshot) => {
          const taskData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(taskData);
        });

        // Fetch habits
        const habitsRef = collection(db, `users/${user.uid}/habits`);
        const unsubscribeHabits = onSnapshot(habitsRef, (snapshot) => {
          const habitData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setHabits(habitData);
        });

        // Fetch study goals
        const goalsRef = collection(db, `users/${user.uid}/goals`);
        const unsubscribeGoals = onSnapshot(goalsRef, (snapshot) => {
          const goalData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setGoals(goalData);
        });

        // Set daily quote
        const today = new Date().toISOString().split("T")[0];
        const storedQuote = localStorage.getItem("dailyQuote");
        const storedDate = localStorage.getItem("quoteDate");

        if (storedDate !== today) {
          const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
          localStorage.setItem("dailyQuote", newQuote);
          localStorage.setItem("quoteDate", today);
          setQuote(newQuote);
        } else {
          setQuote(storedQuote);
        }

        return () => {
          unsubscribeTasks();
          unsubscribeHabits();
          unsubscribeGoals();
        };
      }
    });
    return () => unsubscribeAuth();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-[#2C3E50] mb-4 font-montserrat">Dashboard</h2>
      <div className="mb-6 p-4 bg-[#ECF0F1] rounded-lg">
        <h3 className="text-lg font-medium text-[#F39C12] font-montserrat">Quote of the Day</h3>
        <p className="text-[#7F8C8D] italic font-roboto">"{quote}"</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-[#3498DB] mb-2 font-montserrat">Pending Tasks</h3>
          {tasks.length === 0 ? (
            <p className="text-[#7F8C8D] font-roboto">No pending tasks.</p>
          ) : (
            <div className="space-y-2">
              {tasks.slice(0, 3).map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`p-3 rounded-lg shadow-sm ${
                    task.priority === "High"
                      ? "border-l-4 border-[#F39C12]"
                      : task.priority === "Medium"
                      ? "border-l-4 border-[#3498DB]"
                      : "border-l-4 border-[#7F8C8D]"
                  }`}
                >
                  <p className="text-[#2C3E50] font-roboto">{task.title}</p>
                  <p className="text-sm text-[#7F8C8D] font-roboto">
                    Priority: {task.priority} | Deadline: {task.deadline || "Not set"}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#3498DB] mb-2 font-montserrat">Habit Progress</h3>
          {habits.length === 0 ? (
            <p className="text-[#7F8C8D] font-roboto">No habits tracked.</p>
          ) : (
            <div className="space-y-2">
              {habits.slice(0, 3).map((habit) => (
                <motion.div
                  key={habit.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-3 rounded-lg shadow-sm"
                >
                  <p className="text-[#2C3E50] font-roboto">{habit.name}</p>
                  <div className="w-full bg-[#7F8C8D] rounded-full h-2.5">
                    <div
                      className="bg-[#F39C12] h-2.5 rounded-full"
                      style={{ width: `${(habit.progress / habit.goal) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-[#7F8C8D] font-roboto">
                    Progress: {habit.progress}/{habit.goal}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#3498DB] mb-2 font-montserrat">Study Goals</h3>
          {goals.length === 0 ? (
            <p className="text-[#7F8C8D] font-roboto">No study goals set.</p>
          ) : (
            <div className="space-y-2">
              {goals.slice(0, 3).map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-3 rounded-lg shadow-sm"
                >
                  <p className="text-[#2C3E50] font-roboto">{goal.title}</p>
                  <div className="w-full bg-[#7F8C8D] rounded-full h-2.5">
                    <div
                      className="bg-[#F39C12] h-2.5 rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-[#7F8C8D] font-roboto">{goal.progress}% Complete</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;