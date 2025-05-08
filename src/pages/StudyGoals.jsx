import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db, auth } from "../firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const habitCategories = ["Health", "Productivity", "Learning", "Personal Growth"];

const StudyGoals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: "", objectives: "", reason: "", category: "Productivity" });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const goalsRef = collection(db, `users/${user.uid}/goals`);
        const unsubscribeSnapshot = onSnapshot(goalsRef, (snapshot) => {
          const goalData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setGoals(goalData);
        });
        return () => unsubscribeSnapshot();
      } else {
        setGoals([]);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.title) return;
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = await addDoc(collection(db, `users/${user.uid}/goals`), {
          ...newGoal,
          progress: 0,
          createdAt: new Date().toISOString(),
        });
        setNewGoal({ title: "", objectives: "", reason: "", category: "Productivity" });
        navigate(`/goal/${docRef.id}`);
      }
    } catch (err) {
      console.error("Add goal error:", err);
    }
  };

  const filteredGoals = selectedCategory === "All" ? goals : goals.filter((goal) => goal.category === selectedCategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-xl p-10 w-full max-w-5xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-[#2C3E50] mb-8 font-montserrat text-center">🚀 Study Goals Tracker</h2>

      <form onSubmit={handleAddGoal} className="mb-8 bg-[#F8F9FA] p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Goal Title", placeholder: "e.g., Learn Python", key: "title" },
            { label: "Objectives", placeholder: "e.g., Build a small project", key: "objectives" },
            { label: "Reason", placeholder: "e.g., To advance my career", key: "reason" },
          ].map(({ label, placeholder, key }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">{label}</label>
              <input
                type="text"
                placeholder={placeholder}
                value={newGoal[key]}
                onChange={(e) => setNewGoal({ ...newGoal, [key]: e.target.value })}
                className="w-full p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white font-roboto"
                required
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">Category</label>
            <select
              value={newGoal.category}
              onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
              className="w-full p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white font-roboto"
            >
              {habitCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full md:w-auto px-5 py-3 bg-[#2C3E50] text-white rounded-lg hover:bg-[#3498DB] transition font-roboto"
          >
            Add Goal
          </motion.button>
        </div>
      </form>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {["All", ...habitCategories].map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-3 rounded-lg transition font-roboto ${
              selectedCategory === category ? "bg-[#2C3E50] text-white" : "bg-[#ECF0F1] hover:bg-[#BDC3C7]"
            }`}
          >
            {category}
          </motion.button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredGoals.map((goal) => (
          <motion.div
            key={goal.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-[#ECF0F1] rounded-lg shadow-md hover:shadow-lg transition cursor-pointer w-full"
            onClick={() => navigate(`/goal/${goal.id}`)}
          >
            <h3 className="text-lg font-semibold text-[#2C3E50] font-roboto">{goal.title}</h3>
            <p className="text-[#7F8C8D] font-roboto">Objective: {goal.objectives}</p>
            <span className="text-sm font-medium text-[#3498DB]">{goal.category}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StudyGoals;
