import axios from "axios";

const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;

export const analyzeTasks = async (tasks) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Analyze these tasks and prioritize them based on deadline, estimated time, difficulty, and energy level (1-5). Label each as "Deep Work", "Quick Win", or "Light Focus". Tasks: ${JSON.stringify(tasks)}`,
          },
        ],
      },
      { headers: { Authorization: `Bearer ${openaiApiKey}` } }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return [];
  }
};

export const getFocusFeedback = async (focusRating) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `User rated their focus as ${focusRating}/5. Provide a short feedback message and a tip to improve focus.`,
          },
        ],
      },
      { headers: { Authorization: `Bearer ${openaiApiKey}` } }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "Keep up the effort! Try minimizing distractions.";
  }
};

export const suggestHabitTweaks = async (habit, streak) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `User has a habit: ${habit.name}, current streak: ${streak}. Suggest a tweak to improve consistency.`,
          },
        ],
      },
      { headers: { Authorization: `Bearer ${openaiApiKey}` } }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "Try setting a specific time for this habit!";
  }
};

export const breakDownLearningGoal = async (goal) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Break down the learning goal "${goal}" into phases (e.g., Basics, Intermediate, Projects) with specific tasks and recommend free resources (YouTube, blogs, GitHub).`,
          },
        ],
      },
      { headers: { Authorization: `Bearer ${openaiApiKey}` } }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return [];
  }
};