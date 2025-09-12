import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import api from "../utils/api"; // your axios instance

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please provide email and password");
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/users/login", { email, password });
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-400 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('your-image-url.jpg')" }}
      ></motion.div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white bg-opacity-60 backdrop-blur-md rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center justify-center space-x-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-3 bg-blue-600 text-white rounded-full"
          >
            <FaFacebookF />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-3 bg-red-600 text-white rounded-full"
          >
            <FaGoogle />
          </motion.button>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

