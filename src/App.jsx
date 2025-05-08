import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { auth } from "./firebase";
import Navbar from "./components/Navbar";
import AuthForm from "./components/Auth/AuthForm";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Timer from "./pages/Timer";
import Habits from "./pages/Habits";
import StudyGoals from "./pages/StudyGoals";
import GoalDetail from "./pages/GoalDetail";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECF0F1]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#2C3E50]"></div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-[#ECF0F1] font-sans">
        {user && <Navbar />}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-roboto"
        >
          <Routes>
            <Route path="/" element={<AuthForm />} />
            {user ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/timer" element={<Timer />} />
                <Route path="/habits" element={<Habits />} />
                <Route path="/study-goals" element={<StudyGoals />} />
                <Route path="/goal/:id" element={<GoalDetail />} />
              </>
            ) : (
              <Route path="*" element={<AuthForm />} />
            )}
          </Routes>
        </motion.div>
      </div>
    </Router>
  );
}

export default App;