import { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeeklyReport = () => {
  const [tasksData, setTasksData] = useState([]);
  const [habitsData, setHabitsData] = useState([]);

  useEffect(() => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    // Tasks completed
    const taskQuery = query(
      collection(db, `users/${auth.currentUser.uid}/tasks`),
      where("deadline", ">=", startOfWeek)
    );
    const taskUnsubscribe = onSnapshot(taskQuery, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => doc.data());
      const taskCounts = Array(7).fill(0);
      tasks.forEach((task) => {
        const day = new Date(task.deadline).getDay();
        taskCounts[day]++;
      });
      setTasksData(taskCounts);
    });

    // Habit completions
    const habitQuery = query(
      collection(db, `users/${auth.currentUser.uid}/habits`)
    );
    const habitUnsubscribe = onSnapshot(habitQuery, (snapshot) => {
      const habits = snapshot.docs.map((doc) => doc.data());
      const habitCounts = Array(7).fill(0);
      habits.forEach((habit) => {
        habit.completions.forEach((completion) => {
          if (new Date(completion) >= startOfWeek) {
            const day = new Date(completion).getDay();
            habitCounts[day]++;
          }
        });
      });
      setHabitsData(habitCounts);
    });

    return () => {
      taskUnsubscribe();
      habitUnsubscribe();
    };
  }, []);

  const chartData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Tasks Completed",
        data: tasksData,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Habits Completed",
        data: habitsData,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold">Weekly Report</h2>
      <Line data={chartData} />
    </div>
  );
};

export default WeeklyReport;