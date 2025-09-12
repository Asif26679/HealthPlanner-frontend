import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
      setError("Please enter email and password");
      setLoading(false);
      return;
    }

    try {
      // Replace with your API call
      const { data } = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }).then((res) => res.json());

      if (data?.user && data?.token) {
        login(data.user, data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Background floating circles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <span className="absolute bg-indigo-500 opacity-20 rounded-full w-72 h-72 -top-32 -left-32 animate-ping-slow"></span>
        <span className="absolute bg-pink-500 opacity-20 rounded-full w-64 h-64 -bottom-24 -right-20 animate-ping-slow"></span>
        <span className="absolute bg-yellow-400 opacity-20 rounded-full w-80 h-80 -bottom-40 left-1/2 animate-ping-slow"></span>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-10 bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl animate-fade-in">
        <h2 className="text-4xl font-bold text-white text-center mb-8">Welcome Back</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 rounded-xl bg-gray-700/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 rounded-xl bg-gray-700/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-lg shadow-lg transition transform hover:scale-105"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Don't have an account?{" "}
          <span
            className="text-indigo-400 hover:text-indigo-500 font-semibold cursor-pointer transition"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </span>
        </p>
      </div>

      {/* Tailwind Animations */}
      <style>
        {`
          @keyframes ping-slow {
            0%, 100% { transform: scale(1); opacity: 0.2; }
            50% { transform: scale(1.2); opacity: 0.3; }
          }
          .animate-ping-slow { animation: ping-slow 6s infinite; }
          @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fade-in 0.8s ease forwards; }
        `}
      </style>
    </div>
  );
}

