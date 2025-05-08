import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db, auth } from "../../firebase";
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "Work",
    priority: "Low",
    deadline: "",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState(null);

  const categories = ["Work", "Personal", "Health", "Learning", "Other"];
  const priorities = ["High", "Medium", "Low"];

  useEffect(() => {
    setLoading(true);
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const tasksRef = collection(db, `users/${user.uid}/tasks`);
        const unsubscribeSnapshot = onSnapshot(
          tasksRef,
          (snapshot) => {
            const taskData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setTasks(taskData);
            setLoading(false);
          },
          (err) => {
            console.error("Firestore error:", err);
            setError("Failed to load tasks. Please try again.");
            setLoading(false);
          }
        );
        return () => unsubscribeSnapshot();
      } else {
        setTasks([]);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, `users/${user.uid}/tasks`), {
          title: newTask.title,
          description: newTask.description,
          category: newTask.category,
          priority: newTask.priority,
          deadline: newTask.deadline,
          createdAt: new Date().toISOString(),
        });
        setNewTask({ title: "", description: "", category: "Work", priority: "Low", deadline: "" });
      }
    } catch (err) {
      console.error("Add task error:", err);
      setError("Failed to add task. Please try again.");
    }
  };

  const handleEditTask = async (task) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const taskRef = doc(db, `users/${user.uid}/tasks`, task.id);
        await updateDoc(taskRef, {
          title: task.title,
          description: task.description,
          category: task.category,
          priority: task.priority,
          deadline: task.deadline,
        });
        setEditingTask(null);
      }
    } catch (err) {
      console.error("Edit task error:", err);
      setError("Failed to update task. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const taskRef = doc(db, `users/${user.uid}/tasks`, taskId);
        await deleteDoc(taskRef);
      }
    } catch (err) {
      console.error("Delete task error:", err);
      setError("Failed to delete task. Please try again.");
    }
  };

  const groupedTasks = categories.reduce((acc, category) => {
    acc[category] = tasks.filter((task) => task.category === category);
    return acc;
  }, {});

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#2C3E50]"></div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-[#2C3E50] mb-4 font-montserrat">Your Tasks</h2>
      <form onSubmit={handleAddTask} className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white font-roboto"
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white font-roboto"
          />
          <select
            value={newTask.category}
            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
            className="p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white font-roboto"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            className="p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white font-roboto"
          >
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority} Priority
              </option>
            ))}
          </select>
          <input
            type="date"
            value={newTask.deadline}
            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            className="p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white font-roboto"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-4 py-2 bg-[#2C3E50] text-white rounded-lg hover:bg-[#3498DB] transition font-roboto"
          >
            Add Task
          </motion.button>
        </div>
      </form>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 mb-4 text-center font-roboto"
        >
          {error}
        </motion.p>
      )}
      {tasks.length === 0 ? (
        <p className="text-[#7F8C8D] font-roboto">No tasks yet. Add some to get started!</p>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            groupedTasks[category].length > 0 && (
              <div key={category}>
                <h3 className="text-xl font-semibold text-[#3498DB] mb-2 font-montserrat">{category}</h3>
                <div className="space-y-4">
                  {groupedTasks[category].map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 rounded-lg shadow-sm hover:shadow-md transition ${
                        task.priority === "High"
                          ? "border-l-4 border-[#F39C12] bg-[#ECF0F1]"
                          : task.priority === "Medium"
                          ? "border-l-4 border-[#3498DB] bg-[#ECF0F1]"
                          : "border-l-4 border-[#7F8C8D] bg-[#ECF0F1]"
                      }`}
                    >
                      {editingTask?.id === task.id ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <input
                            type="text"
                            value={editingTask.title}
                            onChange={(e) =>
                              setEditingTask({ ...editingTask, title: e.target.value })
                            }
                            className="p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white font-roboto"
                          />
                          <input
                            type="text"
                            value={editingTask.description}
                            onChange={(e) =>
                              setEditingTask({ ...editingTask, description: e.target.value })
                            }
                            className="p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white font-roboto"
                          />
                          <select
                            value={editingTask.category}
                            onChange={(e) =>
                              setEditingTask({ ...editingTask, category: e.target.value })
                            }
                            className="p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white font-roboto"
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                          <select
                            value={editingTask.priority}
                            onChange={(e) =>
                              setEditingTask({ ...editingTask, priority: e.target.value })
                            }
                            className="p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white font-roboto"
                          >
                            {priorities.map((pri) => (
                              <option key={pri} value={pri}>
                                {pri} Priority
                              </option>
                            ))}
                          </select>
                          <input
                            type="date"
                            value={editingTask.deadline}
                            onChange={(e) =>
                              setEditingTask({ ...editingTask, deadline: e.target.value })
                            }
                            className="p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white font-roboto"
                          />
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEditTask(editingTask)}
                              className="px-4 py-2 bg-[#2C3E50] text-white rounded-lg hover:bg-[#3498DB] transition font-roboto"
                            >
                              Save
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setEditingTask(null)}
                              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-roboto"
                            >
                              Cancel
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-[#2C3E50] font-roboto">{task.title}</h3>
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setEditingTask(task)}
                                className="p-2 text-[#3498DB] hover:text-[#2C3E50] transition"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-2 text-red-500 hover:text-red-600 transition"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </motion.button>
                            </div>
                          </div>
                          {task.description && (
                            <p className="text-[#7F8C8D] font-roboto">{task.description}</p>
                          )}
                          <p className="text-sm text-[#7F8C8D] font-roboto">
                            Priority: {task.priority} | Deadline: {task.deadline || "Not set"}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TaskList;