import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const quotes = [
  "Focus on being productive instead of busy.",
  "Your future is created by what you do today, not tomorrow.",
  "Consistency is what transforms average into excellence.",
  "Small steps each day lead to big results.",
  "Stay dedicated to your goals and watch the magic happen.",
];

const techniques = [
  { name: "Pomodoro", minutes: 25, description: "25 min work, 5 min break" },
  { name: "52/17 Rule", minutes: 52, description: "52 min work, 17 min break" },
  { name: "Deep Work", minutes: 90, description: "90 min focused work" },
  { name: "Ultradian Rhythm", minutes: 90, description: "90 min work, 20 min rest" },
  { name: "Time Blocking", minutes: 60, description: "60 min focused task" },
  { name: "Flowtime", minutes: 45, description: "45 min work, flexible break" },
];

const Timer = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");
  const [technique, setTechnique] = useState("");
  const [quote, setQuote] = useState("");

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
            if (minutes > 0) {
              setMinutes((m) => m - 1);
              return 59;
            } else if (hours > 0) {
              setHours((h) => h - 1);
              setMinutes(59);
              return 59;
            } else {
              setIsRunning(false);
              setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const startTimer = (inputMinutes) => {
    if (inputMinutes >= 60) {
      setHours(Math.floor(inputMinutes / 60));
      setMinutes(inputMinutes % 60);
    } else {
      setHours(0);
      setMinutes(inputMinutes);
    }
    setSeconds(0);
    setIsRunning(true);
    setQuote("");
  };

  const handleCustomStart = () => {
    const min = parseInt(customMinutes);
    if (min > 0) {
      startTimer(min);
      setTechnique("Custom");
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setTechnique("");
    setCustomMinutes("");
    setQuote("");
  };

  const FlipDigit = ({ value, flip }) => (
    <div className="relative w-14 h-20 bg-white rounded-lg shadow-lg flex items-center justify-center text-3xl font-bold text-[#2C3E50] overflow-hidden font-roboto">
      <motion.div
        key={value}
        initial={{ rotateX: flip ? -180 : 0 }}
        animate={{ rotateX: 0 }}
        transition={{ duration: flip ? 0.5 : 0.2, ease: "easeOut" }}
        className="absolute"
      >
        {value.toString().padStart(2, "0")}
      </motion.div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl text-center">
      <h2 className="text-3xl font-bold text-[#2C3E50] mb-4 font-montserrat">Focus Timer</h2>

      <div className="flex justify-center items-center space-x-2">
        {hours > 0 && (
          <>
            <FlipDigit value={hours} flip={minutes === 59 && seconds === 59} />
            <span className="text-lg font-semibold text-[#7F8C8D] font-roboto">hr</span>
          </>
        )}
        <FlipDigit value={minutes} flip={seconds === 59} />
        <span className="text-lg font-semibold text-[#7F8C8D] font-roboto">min</span>
        <span className="text-3xl font-bold text-[#2C3E50] font-roboto">:</span>
        <FlipDigit value={seconds} flip={false} />
        <span className="text-lg font-semibold text-[#7F8C8D] font-roboto">sec</span>
      </div>

      <div className="mt-4 flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsRunning(!isRunning)}
          className={`px-5 py-2 rounded-lg text-white text-lg transition font-roboto ${
            isRunning ? "bg-red-500 hover:bg-red-600" : "bg-[#2C3E50] hover:bg-[#3498DB]"
          }`}
        >
          {isRunning ? "Pause" : "Start"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetTimer}
          className="px-5 py-2 bg-[#7F8C8D] text-white rounded-lg hover:bg-[#5F6A6A] text-lg transition font-roboto"
        >
          Reset
        </motion.button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-[#3498DB] mb-2 font-montserrat">Preset Techniques</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {techniques.map((tech) => (
            <motion.div
              key={tech.name}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="p-4 bg-[#ECF0F1] rounded-lg shadow-lg hover:shadow-xl transition-transform cursor-pointer"
              onClick={() => startTimer(tech.minutes)}
            >
              <h4 className="text-lg font-semibold text-[#2C3E50] font-roboto">{tech.name}</h4>
              <p className="text-[#7F8C8D] font-roboto">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-[#3498DB] mb-2 font-montserrat">Custom Timer</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="number"
            placeholder="Minutes"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            className="p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white w-full sm:w-32 font-roboto"
            min="1"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCustomStart}
            className="px-4 py-2 bg-[#2C3E50] text-white rounded-lg hover:bg-[#3498DB] transition font-roboto"
          >
            Start Custom
          </motion.button>
        </div>
      </div>

      {quote && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-6 text-center text-[#F39C12] font-medium italic font-roboto"
        >
          "{quote}"
        </motion.p>
      )}
    </div>
  );
};

export default Timer;