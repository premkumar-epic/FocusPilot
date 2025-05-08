import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarView = ({ completions }) => {
  const tileClassName = ({ date }) => {
    const isCompleted = completions.some(
      (completion) => new Date(completion).toDateString() === date.toDateString()
    );
    return isCompleted ? "bg-green-200" : null;
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <Calendar tileClassName={tileClassName} />
    </div>
  );
};

export default CalendarView;