import React, { useEffect, useState } from "react";
import {
  Salad,
  Dumbbell,
  Droplets,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../utils/api";

// Animated Number
const AnimatedNumber = ({ value, duration = 1.2, className }) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const diff = value - displayValue;
    if (diff === 0) return;
    const stepTime = duration * 1000 / Math.abs(diff);
    let current = displayValue;
    const timer = setInterval(() => {
      current += diff > 0 ? 1 : -1;
      setDisplayValue(current);
      if ((diff > 0 && current >= value) || (diff < 0 && current <= value)) {
        setDisplayValue(value);
        clearInterval(timer);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value, duration, displayValue]);
  return <span className={className}>{displayValue}</span>;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [diets, setDiets] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [water, setWater] = useState(1200);
  const [loadingDiet, setLoadingDiet] = useState(false);

  // User load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) navigate("/login");
    else setUser(storedUser);
  }, [navigate]);

  // Fetch diets + workouts
  useEffect(() => {
    const fetchDiets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");
        const res = await api.get("/diets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDiets(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDiets();

    // Example workouts
    setWorkouts([
      { _id: 1, title: "Morning Run", duration: 30, caloriesBurned: 250 },
      { _id: 2, title: "Strength Training", duration: 45, caloriesBurned: 400 },
    ]);
  }, [navigate]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Reset water at midnight
  useEffect(() => {
    const now = new Date();
    const millisTillMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
    const timer = setTimeout(() => setWater(0), millisTillMidnight);
    return () => clearTimeout(timer);
  }, [water]);

  // Auto-generate diet
  const handleGenerateDiet = async () => {
    setLoadingDiet(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      // For now using dummy values, later you can open modal to ask user input
      const res = await api.post(
        "/diets/generate",
        {
          age: 25,
          weight: 70,
          height: 175,
          gender: "male",
          activityLevel: "moderate",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDiets([...(diets || []), res.data]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error generating diet");
    } finally {
      setLoadingDiet(false);
    }
  };

  // Delete diet
  const handleDeleteDiet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this diet?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/diets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiets(diets.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error deleting diet");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-950 text-white">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-neutral-950 border-r border-neutral-800 flex-col justify-between py-6 px-4 shadow-xl">
        <div className="mt-10">
          <nav className="space-y-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition"
            >
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition"
            >
              <User className="w-5 h-5" /> Profile
            </Link>
            <Link
              to="/workouts"
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition"
            >
              <Dumbbell className="w-5 h-5" /> Workouts
            </Link>
            <Link
              to="/water"
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition"
            >
              <Droplets className="w-5 h-5" /> Water Intake
            </Link>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-red-600 transition"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 md:p-10 pt-20 md:pt-10 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-9">
              {user ? `Welcome, ${user.name}` : "Welcome"}
            </h1>
            <p className="text-gray-400 mt-2">
              Track your fitness progress and daily goals.
            </p>
          </div>
          <button
            className="md:hidden text-white p-2 rounded-md"
            onClick={() => alert("Open Mobile Menu")}
          >
            <Menu size={28} />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Diet Plans */}
          <div className="col-span-1 lg:col-span-2 bg-neutral-900 rounded-3xl shadow-2xl p-6 border border-neutral-800">
            <div className="flex justify-between mb-4 items-center">
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-green-400">
                <Salad /> Diet Plans
              </h2>
              <button
                onClick={handleGenerateDiet}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl shadow-md text-white transition"
              >
                {loadingDiet ? "Generating..." : "+ Generate Diet"}
              </button>
            </div>

            {(!diets || diets.length === 0) && (
              <p className="text-gray-400 text-sm">No diets yet.</p>
            )}

            <div className="space-y-4">
              {diets.map((diet) => (
                <motion.div
                  key={diet._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-neutral-800 rounded-xl p-4 shadow-lg border border-neutral-700"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{diet.title}</h3>
                    <button
                      onClick={() => handleDeleteDiet(diet._id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-sm text-gray-400">
                    Total Calories: {diet.totalCalories} kcal
                  </p>
                  {/* Meals */}
                  <div className="mt-3 space-y-2">
                    {(diet.meals || []).map((meal, idx) => (
                      <div
                        key={idx}
                        className="bg-neutral-900 p-3 rounded-lg border border-neutral-700"
                      >
                        <h4 className="text-sm font-semibold text-green-300">
                          {meal.name} - {meal.calories} kcal
                        </h4>
                        <ul className="list-disc list-inside text-xs text-gray-400">
                          {(meal.foods || []).map((f, i) => (
                            <li key={i}>
                              {f.name} ({f.calories} kcal, P:
                              {f.protein}g C:{f.carbs}g F:{f.fats}g)
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Workouts */}
          <div className="bg-neutral-900 rounded-3xl shadow-2xl p-6 border border-neutral-800">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-blue-400 mb-4">
              <Dumbbell /> Workouts
            </h2>
            {(!workouts || workouts.length === 0) && (
              <p className="text-gray-400 text-sm">No workouts yet.</p>
            )}
            <ul className="space-y-3">
              {workouts.map((w) => (
                <li
                  key={w._id}
                  className="bg-neutral-800 p-3 rounded-lg text-sm border border-neutral-700"
                >
                  <p className="font-semibold">{w.title}</p>
                  <p className="text-gray-400">
                    {w.duration} mins - {w.caloriesBurned} kcal burned
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Water */}
          <div className="bg-neutral-900 rounded-3xl shadow-2xl p-6 border border-neutral-800">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-cyan-400 mb-4">
              <Droplets /> Water Intake
            </h2>
            <p className="text-gray-400 text-sm mb-2">Today’s intake:</p>
            <p className="text-3xl font-bold text-cyan-300">
              <AnimatedNumber value={water} /> ml
            </p>
            <button
              onClick={() => setWater(water + 250)}
              className="mt-4 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-xl shadow-md text-white transition"
            >
              + Add 250ml
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

}
