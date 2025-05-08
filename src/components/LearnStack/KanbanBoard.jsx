import { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";

const KanbanBoard = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, `users/${auth.currentUser.uid}/learningGoals`),
      (snapshot) => {
        const goalList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setGoals(goalList);
      }
    );
    return () => unsubscribe();
  }, []);

  const updateTaskStatus = async (goalId, phaseIndex, taskId, newStatus) => {
    const goalRef = doc(db, `users/${auth.currentUser.uid}/learningGoals`, goalId);
    const goal = goals.find((g) => g.id === goalId);
    const updatedPhases = [...goal.phases];
    updatedPhases[phaseIndex].tasks = updatedPhases[phaseIndex].tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    await updateDoc(goalRef, { phases: updatedPhases });
  };

  return (
    <div className="p-4">
      {goals.map((goal) => (
        <div key={goal.id} className="mb-8">
          <h2 className="text-xl font-bold">{goal.goal}</h2>
          {goal.phases.map((phase, phaseIndex) => (
            <div key={phase.name} className="mt-4">
              <h3 className="text-lg font-semibold">{phase.name}</h3>
              <div className="flex space-x-4">
                {["To Learn", "Learning", "Done"].map((status) => (
                  <div key={status} className="w-1/3 p-4 bg-gray-100 rounded">
                    <h4 className="font-bold">{status}</h4>
                    {phase.tasks
                      .filter((task) => task.status === status)
                      .map((task) => (
                        <div key={task.id} className="p-2 bg-white shadow rounded mt-2">
                          <p>{task.title}</p>
                          {task.resources && (
                            <ul className="text-sm text-blue-500">
                              {task.resources.map((res, i) => (
                                <li key={i}>
                                  <a href={res} target="_blank" rel="noopener noreferrer">
                                    Resource {i + 1}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                          <select
                            value={task.status}
                            onChange={(e) =>
                              updateTaskStatus(goal.id, phaseIndex, task.id, e.target.value)
                            }
                            className="mt-2 p-1 border rounded"
                          >
                            <option value="To Learn">To Learn</option>
                            <option value="Learning">Learning</option>
                            <option value="Done">Done</option>
                          </select>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;