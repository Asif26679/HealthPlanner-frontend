import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800/70 backdrop-blur-md rounded-3xl p-8 max-w-md w-full">
        <h2 className="text-3xl text-white font-extrabold text-center mb-6">
          {step === "signup" ? "Sign Up" : "Verify OTP"}
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {step === "signup" && (
          <form onSubmit={handleSignup} className="flex flex-col space-y-5">
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-700 text-white rounded-xl px-4 py-3" required />
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-gray-700 text-white rounded-xl px-4 py-3" required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-700 text-white rounded-xl px-4 py-3" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-700 text-white rounded-xl px-4 py-3" required />
            <button type="submit" disabled={loading} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition">
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col space-y-5">
            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="bg-gray-700 text-white rounded-xl px-4 py-3" required />
            <button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button type="button" onClick={handleResendOtp} disabled={loading} className="text-sm text-indigo-400 hover:underline mt-2">Resend OTP</button>
          </form>
        )}
      </div>
    </div>
  );
}


