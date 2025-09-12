import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2, User, Mail, Lock, Key } from "lucide-react";

export default function SignUp() {
  const [step, setStep] = useState("signup"); // "signup" | "otp"
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("https://healthplanner-backend.onrender.com/api/users/signup", {
        name,
        username,
        email,
        password,
      });
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("https://healthplanner-backend.onrender.com/api/users/verify-signup-otp", {
        email,
        otp,
      });
      alert("Signup successful! 🎉 Please login now.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await axios.post("https://healthplanner-backend.onrender.com/api/users/resend-otp", { email });
      alert("OTP resent successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-gray-900 px-4">
      <div className="bg-gray-800/80 backdrop-blur-md rounded-3xl p-8 max-w-md w-full shadow-xl">
        <h2 className="text-3xl text-white font-extrabold text-center mb-2">
          {step === "signup" ? "Create Account" : "Verify Your OTP"}
        </h2>
        <p className="text-center text-gray-400 mb-6 text-sm">
          {step === "signup" ? "Step 1 of 2" : "Step 2 of 2"}
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {step === "signup" && (
          <form onSubmit={handleSignup} className="flex flex-col space-y-4">
            {/* Name */}
            <div className="flex items-center bg-gray-700 rounded-xl px-4">
              <User className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent flex-1 px-2 py-3 text-white placeholder-gray-400 focus:outline-none"
                required
              />
            </div>

            {/* Username */}
            <div className="flex items-center bg-gray-700 rounded-xl px-4">
              <User className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-transparent flex-1 px-2 py-3 text-white placeholder-gray-400 focus:outline-none"
                required
              />
            </div>

            {/* Email */}
            <div className="flex items-center bg-gray-700 rounded-xl px-4">
              <Mail className="text-gray-400" size={20} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent flex-1 px-2 py-3 text-white placeholder-gray-400 focus:outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className="flex items-center bg-gray-700 rounded-xl px-4">
              <Lock className="text-gray-400" size={20} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent flex-1 px-2 py-3 text-white placeholder-gray-400 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign Up"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col space-y-4">
            {/* OTP */}
            <div className="flex items-center bg-gray-700 rounded-xl px-4">
              <Key className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-transparent flex-1 px-2 py-3 text-white placeholder-gray-400 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              className="text-sm text-indigo-400 hover:underline text-center mt-2"
            >
              Resend OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


