import { motion } from "framer-motion";
import TaskList from "../components/TaskManager/TaskList";

const Tasks = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-[#2C3E50] mb-4 font-montserrat">Tasks</h2>
      <TaskList />
    </motion.div>
  );
};

export default Tasks;