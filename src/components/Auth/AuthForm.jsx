import { useState } from "react";
import { motion } from "framer-motion";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed up:", email);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in:", email);
      }
      navigate("/dashboard");
    } catch (error) {
      console.error(`${isSignup ? "Signup" : "Login"} error:`, error.code, error.message);
      setError(error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-[#ECF0F1]"
    >
      <div className="max-w-md w-full mx-4 p-8 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-[#2C3E50] mb-6 font-montserrat">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-[#7F8C8D] font-medium mb-2 font-roboto" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white font-roboto"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-[#7F8C8D] font-medium mb-2 font-roboto" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-[#7F8C8D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition bg-white font-roboto"
              required
            />
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 mb-5 text-center font-roboto"
            >
              {error}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-[#2C3E50] text-white p-3 rounded-lg hover:bg-[#3498DB] transition duration-300 font-roboto"
          >
            {isSignup ? "Sign Up" : "Log In"}
          </motion.button>
        </form>
        <p className="mt-6 text-center text-[#7F8C8D] font-roboto">
          {isSignup ? "Already have an account?" : "Need an account?"}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="ml-1 text-[#3498DB] hover:underline font-medium font-roboto"
          >
            {isSignup ? "Log In" : "Sign Up"}
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default AuthForm;