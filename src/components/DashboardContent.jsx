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
import axios from "axios";
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
  

  const COLORS = ["#3b82f6", "#1e293b"];

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

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  // Water Track
  // useEffect(() => {
  //   // Ask for notification permission
  //   if ("Notification" in window && Notification.permission !== "granted") {
  //     Notification.requestPermission();
  //   }
  
    // Reminder every 2 hours
    // const reminder = setInterval(() => {
    //   if ("Notification" in window && Notification.permission === "granted") {
    //     new Notification("💧 Hydration Reminder", {
    //       body: "Time to drink some water!",
    //       icon: "/water.png", // optional: put a water icon in public folder
    //     });
    //   }
    // }, 2 * 60 * 60 * 1000); // every 2 hours
  
  //   return () => clearInterval(reminder);
  // }, []);
  useEffect(() => {
    const now = new Date();
    const millisTillMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;
  
    const timer = setTimeout(() => setWater(0), millisTillMidnight);
  
    return () => clearTimeout(timer);
  }, [water]);
  
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
      {/* Desktop Sidebar */}
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
        <Link
          to="/dashboard"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition"
        >
          <LayoutDashboard className="w-5 h-5" /> Dashboard
        </Link>

        <Link
          to="/profile"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition"
        >
          <User className="w-5 h-5" /> Profile
        </Link>

        <Link
          to="/workouts"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition"
        >
          <Dumbbell className="w-5 h-5" /> Workouts
        </Link>

        <Link
          to="/water"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition"
        >
          <Droplets className="w-5 h-5" /> Water Intake
        </Link>
      </nav>

      <div className="mt-auto space-y-3">
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-neutral-800 shadow-sm">
          <User className="w-6 h-6 text-green-400" />
          <span className="text-gray-200 font-medium">{user ? `Welcome, ${user.name}` : "Welcome"}</span>
        </div>
        <button
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-red-500 hover:bg-neutral-800 transition w-full shadow-sm"
          onClick={handleLogout}
        >
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

        {/* Diet Section */}
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
          <h3 className="text-lg md:text-xl font-bold text-white mb-2">
            {diet.title}
          </h3>
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
  <div className="bg-neutral-900 rounded-3xl shadow-2xl p-6 border border-neutral-800 flex flex-col justify-between">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold text-blue-400">
        <Droplets className="w-6 h-6" /> Water Plan
      </h2>
      <span className="text-gray-400 text-sm">Daily Goal: 2500ml</span>
    </div>

    {/* Progress */}
    <div className="flex flex-col items-center justify-center mt-6">
      <p className="text-gray-200 text-lg font-medium">
        {water} ml <span className="text-gray-400 text-sm"> / 2500 ml</span>
      </p>
      <div className="w-full bg-gray-700 rounded-full h-3 mt-3">
        <div
          className="bg-blue-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${(water / 2500) * 100}%` }}
        ></div>
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
  </div>
</div>



      </main>

      {/* Diet Modal */}
      <AnimatePresence>
        {showDietModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-gray-800 p-6 rounded-2xl w-full max-w-xl relative">
              <button onClick={() => setShowDietModal(false)} className="absolute top-4 right-4 text-red-500 hover:text-white"><X size={24} /></button>
              <h2 className="text-2xl font-bold text-white mb-4">{editDiet ? "Edit Diet Plan" : "Create Diet Plan"}</h2>
              <form onSubmit={handleSaveDiet} className="flex flex-col gap-4">
                <input type="text" placeholder="Title (Ex-Weight Gain)" value={dietTitle} onChange={(e) => setDietTitle(e.target.value)} className="bg-gray-700 text-white rounded-xl px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" required />
                {meals.map((meal, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input type="text" placeholder="Meal Name" value={meal.name} onChange={(e) => handleMealChange(i, "name", e.target.value)} className="bg-gray-700 text-white rounded-xl px-3 py-2 flex-1" required />
                    <input type="number" placeholder="Calories" value={meal.calories} onChange={(e) => handleMealChange(i, "calories", e.target.value)} className="bg-gray-700 text-white rounded-xl px-3 py-2 w-24" required />
                    {meals.length > 1 && <button type="button" onClick={() => removeMeal(i)} className="text-red-500 font-bold">X</button>}
                  </div>
                ))}
                <button type="button" onClick={addMeal} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm shadow-md transition">Add Meal</button>
                <button type="submit" disabled={loadingDiet} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow-md transition disabled:opacity-50">{loadingDiet ? "Saving..." : editDiet ? "Update Diet" : "Create Diet"}</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



