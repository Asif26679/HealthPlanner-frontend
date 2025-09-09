import React, { useEffect, useState } from "react";
import {
  Salad,
  Dumbbell,
  Droplets,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  Coffee,
  Apple,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";

// Animated Number Component
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

// Meal Icon helper
const getMealIcon = (name) => {
  if (/coffee/i.test(name)) return <Coffee className="w-5 h-5 text-yellow-400" />;
  if (/apple|fruit/i.test(name)) return <Apple className="w-5 h-5 text-red-400" />;
  return <Salad className="w-5 h-5 text-green-400" />;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [diets, setDiets] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [water, setWater] = useState(1200);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDietModal, setShowDietModal] = useState(false);
  const [editDiet, setEditDiet] = useState(null);
  const [dietTitle, setDietTitle] = useState("");
  const [meals, setMeals] = useState([{ name: "", calories: "" }]);
  const [loadingDiet, setLoadingDiet] = useState(false);
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  // Fetch diets and workouts
  useEffect(() => {
    const fetchDiets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await api.get("/dites", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.length > 0) setDiets(res.data);
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

  // Reset water at midnight
  useEffect(() => {
    const now = new Date();
    const millisTillMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;

    const timer = setTimeout(() => setWater(0), millisTillMidnight);

    return () => clearTimeout(timer);
  }, [water]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Meal handlers
  const handleMealChange = (index, field, value) => {
    const updated = [...meals];
    updated[index][field] = field === "calories" ? Number(value) : value;
    setMeals(updated);
  };
  const addMeal = () => setMeals([...meals, { name: "", calories: "" }]);
  const removeMeal = (index) => setMeals(meals.filter((_, i) => i !== index));

  // Open modal
  const openCreateModal = () => {
    setEditDiet(null);
    setDietTitle("");
    setMeals([{ name: "", calories: "" }]);
    setShowDietModal(true);
  };
  const openEditModal = (diet) => {
    setEditDiet(diet);
    setDietTitle(diet.title);
    setMeals(diet.meals);
    setShowDietModal(true);
  };

  // Create or update diet
  const handleSaveDiet = async (e) => {
    e.preventDefault();
    setLoadingDiet(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editDiet) {
        const res = await api.put(
          `/dites/${editDiet._id}`,
          { title: dietTitle, meals },
          config
        );
        setDiets(diets.map((d) => (d._id === res.data._id ? res.data : d)));
      } else {
        const res = await api.post(
          "/dites",
          { title: dietTitle, meals },
          config
        );
        setDiets([...diets, res.data]);
      }

      setShowDietModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving diet");
    } finally {
      setLoadingDiet(false);
    }
  };

  // Delete diet
  const handleDeleteDiet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this diet?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/dites/${id}`, {
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
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </Link>
            <Link to="/profile" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition">
              <User className="w-5 h-5" /> Profile
            </Link>
            <Link to="/workouts" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition">
              <Dumbbell className="w-5 h-5" /> Workouts
            </Link>
            <Link to="/water" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition">
              <Droplets className="w-5 h-5" /> Water Intake
            </Link>
          </nav>
        </div>
        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-neutral-800 shadow-sm">
            <User className="w-6 h-6 text-green-400" />
            <span className="text-gray-200 font-medium">{user ? `Welcome, ${user.name}` : "Welcome"}</span>
          </div>
          <button className="flex items-center gap-3 px-4 py-2 rounded-xl text-red-500 hover:bg-neutral-800 transition w-full shadow-sm" onClick={handleLogout}>
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-y-0 right-0 w-64 bg-neutral-950 z-50 shadow-xl p-6 flex flex-col justify-between md:hidden"
          >
            <nav className="space-y-3 mt-10">
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition">
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition">
                <User className="w-5 h-5" /> Profile
              </Link>
              <Link to="/workouts" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition">
                <Dumbbell className="w-5 h-5" /> Workouts
              </Link>
              <Link to="/water" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition">
                <Droplets className="w-5 h-5" /> Water Intake
              </Link>
            </nav>
            <div className="mt-auto space-y-3">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-neutral-800 shadow-sm">
                <User className="w-6 h-6 text-green-400" />
                <span className="text-gray-200 font-medium">{user ? `Welcome, ${user.name}` : "Welcome"}</span>
              </div>
              <button className="flex items-center gap-3 px-4 py-2 rounded-xl text-red-500 hover:bg-neutral-800 transition w-full shadow-sm" onClick={handleLogout}>
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 pt-20 md:pt-10 overflow-y-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-9">{user ? `Welcome, ${user.name}` : "Welcome"}</h1>
          <p className="text-gray-400 mt-2">Track your fitness progress and daily goals.</p>
        </header>

        {/* Diet + Water Section */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Diet Plans */}
          <div className="col-span-1 lg:col-span-2 bg-neutral-900 rounded-3xl shadow-2xl p-4 sm:p-6 border border-neutral-800">
            <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold text-green-400">
                <Salad /> Diet Plans
              </h2>
              <button
                onClick={openCreateModal}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow-md transition w-full sm:w-auto"
              >
                + Create Diet
              </button>
            </div>
            {diets.length === 0 && (
              <p className="text-gray-400 text-center py-6">No diets yet.</p>
            )}
            <div className="flex flex-col gap-4">
              {diets.map((diet) => (
                <motion.div
                  key={diet._id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-green-700 via-green-900 to-green-700 p-4 sm:p-6 rounded-2xl shadow-lg relative border border-green-500"
                >
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">{diet.title}</h3>
                  <p className="text-gray-200 mb-4">
                    Total Calories:{" "}
                    <AnimatedNumber
                      value={diet.totalCalories}
                      className="font-bold text-yellow-400"
                    />
                  </p>
                  <ul className="flex flex-col gap-2">
                    {diet.meals.map((meal, i) => (
                      <li
                        key={i}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-green-900/30 p-3 rounded-lg shadow-sm hover:bg-green-900/50 transition"
                      >
                        <span className="flex items-center gap-2">
                          {getMealIcon(meal.name)} {meal.name}
                        </span>
                        <span className="text-sm text-gray-200 mt-1 sm:mt-0">
                          {meal.calories} kcal
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="absolute top-4 right-4 flex gap-2 flex-wrap sm:flex-nowrap">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg text-white text-sm shadow-md transition w-full sm:w-auto"
                      onClick={() => openEditModal(diet)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-white text-sm shadow-md transition w-full sm:w-auto"
                      onClick={() => handleDeleteDiet(diet._id)}
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 💧 Water Intake Tracker */}
          <div className="bg-neutral-900 rounded-3xl shadow-2xl p-6 border border-neutral-800 flex flex-col items-center">
            {/* Header */}
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold text-blue-400">
              <Droplets className="w-6 h-6" /> Water Plan
            </h2>
            <span className="text-gray-400 text-sm mt-1">Daily Goal: 2500ml</span>

            {/* Circular Progress */}
            <div className="relative mt-6 w-36 h-36">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="65"
                  stroke="gray"
                  strokeWidth="10"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="65"
                  stroke="url(#blueGradient)"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 65}
                  strokeDashoffset={2 * Math.PI * 65 - (water / 2500) * 2 * Math.PI * 65}
                  className={`transition-all duration-700 ${water >= 2500 ? "text-green-500 drop-shadow-lg" : "text-blue-500"}`}
                />
                <defs>
                  <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Percentage Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {Math.min(Math.round((water / 2500) * 100), 100)}%
                </span>
                <span className="text-gray-400 text-sm">{water} ml</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <button
                onClick={() => setWater((prev) => Math.min(prev + 250, 2500))}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl shadow-md text-sm sm:text-base"
              >
                +250ml
              </button>
              <button
                onClick={() => setWater((prev) => Math.min(prev + 500, 2500))}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl shadow-md text-sm sm:text-base"
              >
                +500ml
              </button>
              <button
                onClick={() => setWater(0)}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl shadow-md text-sm sm:text-base"
              >
                Reset
              </button>
            </div>

            {/* Success Message */}
            {water >= 2500 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-green-400 font-semibold"
              >
                🎉 Goal Achieved!
              </motion.p>
            )}
          </div>
        </div>
      </main>

      {/* Floating Mobile Menu Button */}
      <button
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 p-3 rounded-full shadow-lg md:hidden z-50"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>

      {/* Diet Modal */}
      <AnimatePresence>
        {showDietModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-neutral-900 rounded-2xl p-6 w-full max-w-lg shadow-xl border border-neutral-800"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-2xl font-bold text-green-400 mb-4">
                {editDiet ? "Edit Diet" : "Create Diet"}
              </h2>
              <form onSubmit={handleSaveDiet} className="space-y-4">
                <div>
                  <label className="block text-gray-300">Diet Title</label>
                  <input
                    type="text"
                    value={dietTitle}
                    onChange={(e) => setDietTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700"
                    required
                  />
                </div>

                {meals.map((meal, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Meal Name"
                      value={meal.name}
                      onChange={(e) => handleMealChange(index, "name", e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Calories"
                      value={meal.calories}
                      onChange={(e) => handleMealChange(index, "calories", e.target.value)}
                      className="w-32 px-3 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700"
                      required
                    />
                    {meals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMeal(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg shadow-md"
                      >
                        X
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addMeal}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
                >
                  + Add Meal
                </button>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowDietModal(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loadingDiet}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md disabled:opacity-50"
                  >
                    {loadingDiet ? "Saving..." : "Save Diet"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



