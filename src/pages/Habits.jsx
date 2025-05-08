import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db, auth } from "../firebase";
import { collection, addDoc, onSnapshot, doc, updateDoc } from "firebase/firestore";

const tips = [
  "Start small to build consistency over time.",
  "Set specific times for your habits to create a routine.",
  "Track your progress to stay motivated!",
  "Reward yourself for sticking to your habits.",
  "Don’t break the chain—consistency is key!",
];

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState({
    name: "",
    category: "Health",
    endDate: "",
    frequency: "Daily",
    progress: 0,
    goal: 30, // Default goal: 30 days
  });
  const [tip, setTip] = useState(tips[0]);
  const categories = ["Health", "Productivity", "Learning", "Personal", "Other"];
  const frequencies = ["Daily", "Weekly", "Monthly"];

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const habitsRef = collection(db, `users/${user.uid}/habits`);
        const unsubscribeSnapshot = onSnapshot(habitsRef, (snapshot) => {
          const habitData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setHabits(habitData);
        });
        return () => unsubscribeSnapshot();
      } else {
        setHabits([]);
      }
    });
    setTip(tips[Math.floor(Math.random() * tips.length)]);
    return () => unsubscribeAuth();
  }, []);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.name) return;
    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, `users/${user.uid}/habits`), {
          name: newHabit.name,
          category: newHabit.category,
          endDate: newHabit.endDate,
          frequency: newHabit.frequency,
          progress: 0,
          goal: newHabit.goal,
          createdAt: new Date().toISOString(),
        });
        setNewHabit({ name: "", category: "Health", endDate: "", frequency: "Daily", progress: 0, goal: 30 });
      }
    } catch (err) {
      console.error("Add habit error:", err);
    }
  };

  const handleProgressUpdate = async (habit) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const habitRef = doc(db, `users/${user.uid}/habits`, habit.id);
        const newProgress = Math.min(habit.progress + 1, habit.goal);
        await updateDoc(habitRef, { progress: newProgress });
      }
    } catch (err) {
      console.error("Update habit progress error:", err);
    }
  };

  const groupedHabits = categories.reduce((acc, category) => {
    acc[category] = habits.filter((habit) => habit.category === category);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-[#2C3E50] mb-4 font-montserrat">Habits</h2>
      <div className="mb-6 p-4 bg-[#ECF0F1] rounded-lg">
        <h3 className="text-lg font-medium text-[#F39C12] font-montserrat">Habit Tip of the Day</h3>
        <p className="text-[#7F8C8D] font-roboto">{tip}</p>
      </div>
      <form onSubmit={handleAddHabit} className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Habit Name"
            value={newHabit.name}
            onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
            className="p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white font-roboto"
            required
          />
          <select
            value={newHabit.category}
            onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
            className="p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white font-roboto"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={newHabit.frequency}
            onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
            className="p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white font-roboto"
          >
            {frequencies.map((freq) => (
              <option key={freq} value={freq}>
                {freq}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={newHabit.endDate}
            onChange={(e) => setNewHabit({ ...newHabit, endDate: e.target.value })}
            className="p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white font-roboto"
          />
          <input
            type="number"
            placeholder="Goal (e.g., 30 days)"
            value={newHabit.goal}
            onChange={(e) => setNewHabit({ ...newHabit, goal: parseInt(e.target.value) || 30 })}
            className="p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white font-roboto"
            min="1"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-4 py-2 bg-[#2C3E50] text-white rounded-lg hover:bg-[#3498DB] transition font-roboto"
          >
            Add Habit
          </motion.button>
        </div>
      </form>
      <div className="space-y-6">
        {categories.map((category) => (
          groupedHabits[category].length > 0 && (
            <div key={category}>
              <h3 className="text-xl font-semibold text-[#3498DB] mb-2 font-montserrat">{category}</h3>
              <div className="space-y-4">
                {groupedHabits[category].map((habit) => (
                  <motion.div
                    key={habit.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-[#ECF0F1] rounded-lg shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-semibold text-[#2C3E50] font-roboto">{habit.name}</h4>
                        <p className="text-[#7F8C8D] font-roboto">
                          Frequency: {habit.frequency} | End Date: {habit.endDate || "Not set"}
                        </p>
                        <div className="mt-2">
                          <div className="w-full bg-[#7F8C8D] rounded-full h-2.5">
                            <div
                              className="bg-[#F39C12] h-2.5 rounded-full"
                              style={{ width: `${(habit.progress / habit.goal) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-[#7F8C8D] text-sm font-roboto">
                            Progress: {habit.progress}/{habit.goal}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleProgressUpdate(habit)}
                        className="px-4 py-2 bg-[#2C3E50] text-white rounded-lg hover:bg-[#3498DB] transition font-roboto"
                      >
                        Mark Done
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </motion.div>
  );
};

export default Habits;