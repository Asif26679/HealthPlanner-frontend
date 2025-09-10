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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";

// Animated number for calories, etc.
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-generate diet form fields
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("sedentary");

  // Load user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) navigate("/login");
    else setUser(storedUser);
  }, [navigate]);

  // Fetch diets and workouts
  useEffect(() => {
    const fetchDiets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");
        const res = await api.get("/diets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDiets(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDiets();

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

  // Water reset at midnight
  useEffect(() => {
    const now = new Date();
    const millisTillMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
    const timer = setTimeout(() => setWater(0), millisTillMidnight);
    return () => clearTimeout(timer);
  }, [water]);

  // Generate diet
  const handleGenerateDiet = async (e) => {
    e.preventDefault();
    if (!age || !weight || !height || !activityLevel) {
      return alert("Please fill all fields for auto-generation.");
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await api.post("/diets/generate", {
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
        activityLevel,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDiets([res.data, ...diets]);
      setShowGenerateModal(false);
      setAge(""); setWeight(""); setHeight(""); setActivityLevel("sedentary");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error generating diet");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDiet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this diet?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/diets/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setDiets(diets.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error deleting diet");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-950 text-white">

      {/* Sidebar */}
      <aside className={`fixed md:relative z-50 w-64 bg-neutral-950 border-r border-neutral-800 flex-col justify-between py-6 px-4 shadow-xl ${mobileMenuOpen ? "flex" : "hidden md:flex"}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Menu</h2>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(false)}><X /></button>
        </div>
        <nav className="space-y-3 flex-1">
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
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-red-600 transition mt-6">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 pt-20 md:pt-10 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-9">{user ? `Welcome, ${user.name}` : "Welcome"}</h1>
            <p className="text-gray-400 mt-2">Track your fitness progress and daily goals.</p>
          </div>
          <button className="md:hidden text-white p-2 rounded-md" onClick={() => setMobileMenuOpen(true)}><Menu size={28} /></button>
        </header>

        {/* Diet Plans */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-green-400 flex items-center gap-2"><Salad /> Diet Plans</h2>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl shadow-md text-white transition"
          >
            + Generate Diet
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {diets.length === 0 && <p className="text-gray-400 text-center col-span-full">No diets yet.</p>}
          {diets.map(diet => (
            <motion.div key={diet._id} whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-green-700 via-green-900 to-green-700 p-4 rounded-2xl shadow-lg relative border border-green-500 overflow-hidden">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white mb-2">{diet.title}</h3>
                <button className="text-gray-200 text-sm" onClick={() => handleDeleteDiet(diet._id)}>Delete</button>
              </div>
              <div className="mt-2">
                <p className="text-gray-200 mb-2">Total Calories: <AnimatedNumber value={diet.totalCalories} className="font-bold text-yellow-400" /></p>
                <ul className="flex flex-col gap-2">
                  {diet.meals?.map((meal, i) => (
                    <li key={i} className="flex justify-between items-center bg-green-900/30 p-3 rounded-lg shadow-sm hover:bg-green-900/50 transition">
                      <span>{meal.name}</span>
                      <span>{meal.calories} kcal</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Workouts */}
        <div className="bg-neutral-900 rounded-3xl shadow-2xl p-6 border border-neutral-800 mb-8">
          <h2 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center gap-2"><Dumbbell /> Workouts</h2>
          <ul className="flex flex-col gap-3">
            {workouts.map(w => (
              <li key={w._id} className="flex justify-between bg-yellow-900/20 p-3 rounded-xl shadow-sm hover:bg-yellow-900/50 transition">
                <span>{w.title}</span>
                <span>{w.duration} min | <span className="text-yellow-400">{w.caloriesBurned} kcal</span></span>
              </li>
            ))}
          </ul>
        </div>

        {/* Water Tracker */}
        <div className="bg-neutral-900 rounded-3xl shadow-2xl p-6 border border-neutral-800 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2"><Droplets /> Water Intake</h2>
          <div className="w-full bg-neutral-800 rounded-xl h-6 overflow-hidden mb-4">
            <motion.div className="bg-blue-500 h-6" animate={{ width: `${Math.min(100, (water/2000)*100)}%` }} />
          </div>
          <p className="text-gray-200 mb-2">{water} ml / 2000 ml</p>
          <div className="flex gap-3">
            <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl" onClick={() => setWater(prev => Math.min(prev + 200, 2000))}>+200 ml</button>
            <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl" onClick={() => setWater(prev => Math.max(prev - 200, 0))}>-200 ml</button>
          </div>
        </div>

        {/* Generate Diet Modal */}
        <AnimatePresence>
          {showGenerateModal && (
            <motion.div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-neutral-900 rounded-3xl p-6 w-11/12 max-w-md relative shadow-2xl"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4">Generate Diet</h2>
                <form onSubmit={handleGenerateDiet} className="flex flex-col gap-3">
                  <input type="number" placeholder="Age" className="p-2 rounded-lg bg-neutral-800" value={age} onChange={e => setAge(e.target.value)} />
                  <input type="number" placeholder="Weight (kg)" className="p-2 rounded-lg bg-neutral-800" value={weight} onChange={e => setWeight(e.target.value)} />
                  <input type="number" placeholder="Height (cm)" className="p-2 rounded-lg bg-neutral-800" value={height} onChange={e => setHeight(e.target.value)} />
                  <select value={activityLevel} onChange={e => setActivityLevel(e.target.value)} className="p-2 rounded-lg bg-neutral-800">
                    <option value="sedentary">Sedentary</option>
                    <option value="lightly">Lightly Active</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                    <option value="very">Very Active</option>
                  </select>
                  <button type="submit" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl text-white" disabled={loading}>
                    {loading ? "Generating..." : "Generate Diet"}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
