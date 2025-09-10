import React, { useEffect, useState } from "react";
import {
  Salad,
  Dumbbell,
  Droplets,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
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
  const [user, setUser] = useState(null);
  const [diets, setDiets] = useState([]);
  const [water, setWater] = useState(1200);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadingDiet, setLoadingDiet] = useState(false);

  // User data
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("sedentary");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) navigate("/login");
    else setUser(storedUser);
  }, [navigate]);

  // Fetch existing diets
  useEffect(() => {
    const fetchDiets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");
        const res = await api.get("/dites", { headers: { Authorization: `Bearer ${token}` } });
        if (res.data.length > 0) setDiets(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDiets();
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

  // Auto-generate diet
  const handleGenerateDiet = async (e) => {
    e.preventDefault();
    if (!age || !weight || !height || !activityLevel) {
      return alert("Please fill all fields for auto-generation.");
    }
    setLoadingDiet(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await api.post("/dites/generate", {
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
        activityLevel,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDiets([...diets, res.data]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error generating diet");
    } finally {
      setLoadingDiet(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-950 text-white">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 bg-neutral-950 border-r border-neutral-800 flex-col justify-between py-6 px-4 shadow-xl">
        <div className="mt-10">
          <nav className="space-y-3">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </Link>
            <Link to="/profile" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition">
              <User className="w-5 h-5" /> Profile
            </Link>
          </nav>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-red-600 transition">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 pt-20 md:pt-10 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-9">{user ? `Welcome, ${user.name}` : "Welcome"}</h1>
            <p className="text-gray-400 mt-2">Track your fitness progress and auto-generated diets.</p>
          </div>
          <button className="md:hidden text-white p-2 rounded-md" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={28} />
          </button>
        </header>

        {/* User Inputs for auto-generation */}
        <div className="bg-neutral-900 rounded-3xl shadow-2xl p-6 mb-6 border border-neutral-800">
          <h2 className="text-xl font-semibold text-green-400 mb-4">Generate Your Diet</h2>
          <form onSubmit={handleGenerateDiet} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white" required/>
            <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white" required/>
            <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white" required/>
            <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white">
              <option value="sedentary">Sedentary</option>
              <option value="lightly">Lightly Active</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very">Very Active</option>
            </select>
            <button type="submit" className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl ${loadingDiet ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loadingDiet}>
              {loadingDiet ? "Generating..." : "Generate Diet"}
            </button>
          </form>
        </div>

        {/* Diet Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diets.length === 0 && <p className="text-gray-400 text-center col-span-2">No diets yet. Generate one above.</p>}
          {diets.map((diet) => (
            <div key={diet._id} className="bg-green-900/30 p-6 rounded-2xl shadow-lg border border-green-500">
              <h3 className="text-xl font-bold text-white mb-2">{diet.title}</h3>
              <p className="text-gray-200 mb-2">Total Calories: <AnimatedNumber value={diet.totalCalories} className="text-yellow-400 font-bold" /></p>
              {diet.meals.map((meal, i) => (
                <div key={i} className="mb-4 bg-neutral-900/40 p-3 rounded-xl border border-neutral-700">
                  <div className="flex justify-between items-center mb-1">
                    <span className="flex items-center gap-2 text-white font-semibold">{getMealIcon(meal.name)} {meal.name}</span>
                    <span className="text-sm text-gray-300">{meal.calories} kcal</span>
                  </div>
                  <ul className="ml-5 text-gray-300 list-disc">
                    {meal.foods.map((food, j) => (
                      <li key={j}>{food.name} - {food.calories} kcal | P: {food.protein}g, C: {food.carbs}g, F: {food.fats}g</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: "-100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "-100%" }} 
            className="fixed inset-0 bg-neutral-950 z-50 flex flex-col w-64 p-6 shadow-xl"
          >
            <button onClick={() => setMobileMenuOpen(false)} className="self-end text-white mb-4"><X size={24} /></button>
            <nav className="space-y-3">
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition">
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition">
                <User className="w-5 h-5" /> Profile
              </Link>
            </nav>
            <button onClick={handleLogout} className="mt-auto flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-red-600 transition">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
