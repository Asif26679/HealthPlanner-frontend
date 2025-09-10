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

// High Calorie Badge
const HighCalBadge = ({ calories }) => {
  if (calories > 500) return <span className="ml-2 bg-red-500 text-xs px-1 rounded">High Cal</span>;
  return null;
};

// Calculate total macros
// Updated calculateTotalMacros
const calculateTotalMacros = (meals) => {
  return meals.reduce(
    (acc, m) => ({
      protein: acc.protein + (m.protein || 0),
      carbs: acc.carbs + (m.carbs || 0),
      fats: acc.fats + (m.fats || 0),
    }),
    { protein: 0, carbs: 0, fats: 0 }
  );
};


export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [diets, setDiets] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [water, setWater] = useState(1200);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDietModal, setShowDietModal] = useState(false);
  const [editDiet, setEditDiet] = useState(null);
  const [dietTitle, setDietTitle] = useState("");
  const [meals, setMeals] = useState([{ name: "", calories: 0, protein: 0, carbs: 0, fats: 0 }]);
  const [loadingDiet, setLoadingDiet] = useState(false);
  const [collapsedDiets, setCollapsedDiets] = useState({});

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

        const res = await api.get("/dites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.length > 0) setDiets(res.data);
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
    const millisTillMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
    const timer = setTimeout(() => setWater(0), millisTillMidnight);
    return () => clearTimeout(timer);
  }, [water]);

  // Meal handlers
  const handleMealChange = (index, field, value) => {
    const updated = [...meals];
    updated[index][field] = field === "calories" || field === "protein" || field === "carbs" || field === "fats" ? Number(value) : value;
    setMeals(updated);
  };
  const addMeal = () => setMeals([...meals, { name: "", calories: 0, protein: 0, carbs: 0, fats: 0 }]);
  const removeMeal = (index) => setMeals(meals.filter((_, i) => i !== index));

  const openCreateModal = () => {
    setEditDiet(null);
    setDietTitle("");
    setMeals([{ name: "", calories: 0, protein: 0, carbs: 0, fats: 0 }]);
    setShowDietModal(true);
  };
  const openEditModal = (diet) => {
    setEditDiet(diet);
    setDietTitle(diet.title);
    setMeals(diet.meals);
    setShowDietModal(true);
  };

  const handleSaveDiet = async (e) => {
    e.preventDefault();
    setLoadingDiet(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editDiet) {
        const res = await api.put(`/dites/${editDiet._id}`, { title: dietTitle, meals }, config);
        setDiets(diets.map((d) => (d._id === res.data._id ? res.data : d)));
      } else {
        const res = await api.post("/dites", { title: dietTitle, meals }, config);
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

  const handleDeleteDiet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this diet?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/dites/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setDiets(diets.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error deleting diet");
    }
  };

  const toggleCollapseDiet = (id) => {
    setCollapsedDiets((prev) => ({ ...prev, [id]: !prev[id] }));
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
            <Link to="/workouts" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition">
              <Dumbbell className="w-5 h-5" /> Workouts
            </Link>
            <Link to="/water" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-neutral-800 transition">
              <Droplets className="w-5 h-5" /> Water Intake
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
            <p className="text-gray-400 mt-2">Track your fitness progress and daily goals.</p>
          </div>
          <button className="md:hidden text-white p-2 rounded-md" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={28} />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Diet Plans */}
          <div className="col-span-1 lg:col-span-2 bg-neutral-900 rounded-3xl shadow-2xl p-6 border border-neutral-800">
            <div className="flex justify-between mb-4 items-center">
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-green-400"><Salad /> Diet Plans</h2>
              <button onClick={openCreateModal} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl shadow-md text-white transition">+ Create Diet</button>
            </div>

            {diets.length === 0 && <p className="text-gray-400 text-center py-6">No diets yet.</p>}

            <div className="flex flex-col gap-4">
              {diets.map((diet) => {
                 const totalMacros = {
                  protein: diet.totalProtein || calculateTotalMacros(diet.meals).protein,
                  carbs: diet.totalCarbs || calculateTotalMacros(diet.meals).carbs,
                  fats: diet.totalFats || calculateTotalMacros(diet.meals).fats,
                };
                return (
                  <motion.div key={diet._id} whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-green-700 via-green-900 to-green-700 p-4 rounded-2xl shadow-lg relative border border-green-500 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white mb-2">{diet.title}</h3>
                      <button className="text-gray-200 text-sm md:hidden" onClick={() => toggleCollapseDiet(diet._id)}>
                        {collapsedDiets[diet._id] ? "▼" : "▲"}
                      </button>
                    </div>

                    <AnimatePresence>
                      {!collapsedDiets[diet._id] && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2">
                          <p className="text-gray-200 mb-2">Total Calories: <AnimatedNumber value={diet.totalCalories} className="font-bold text-yellow-400" /></p>
                          <p className="text-gray-200 mb-2">
                            Protein: <AnimatedNumber value={totalMacros.protein} className="text-yellow-400 font-bold" /> g | 
                            Carbs: <AnimatedNumber value={totalMacros.carbs} className="text-blue-400 font-bold" /> g | 
                            Fats: <AnimatedNumber value={totalMacros.fats} className="text-red-400 font-bold" /> g
                          </p>
                          <ul className="flex flex-col gap-2">
                            {diet.meals.map((meal, i) => (
                              <li key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-green-900/30 p-3 rounded-lg shadow-sm hover:bg-green-900/50 transition">
                                <span className="flex items-center gap-2">{getMealIcon(meal.name)} {meal.name} <HighCalBadge calories={meal.calories} /></span>
                                <span className="text-sm text-gray-200 mt-1 sm:mt-0">{meal.calories} kcal</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="absolute top-4 right-4 flex gap-2 flex-wrap sm:flex-nowrap">
                      <button className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg text-white text-sm shadow-md transition" onClick={() => openEditModal(diet)}>Edit</button>
                      <button className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-white text-sm shadow-md transition" onClick={() => handleDeleteDiet(diet._id)}>Delete</button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
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

          {/* Workouts */}
          <div className="bg-neutral-900 rounded-3xl shadow-2xl p-6 border border-neutral-800 col-span-1 lg:col-span-3 mt-6">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center gap-2"><Dumbbell /> Workouts</h2>
            {workouts.length === 0 && <p className="text-gray-400 text-center py-6">No workouts yet.</p>}
            <ul className="flex flex-col gap-3">
              {workouts.map(w => (
                <li key={w._id} className="flex justify-between bg-yellow-900/20 p-3 rounded-xl shadow-sm hover:bg-yellow-900/50 transition">
                  <span>{w.title}</span>
                  <span>{w.duration} min | <span className="text-yellow-400">{w.caloriesBurned} kcal</span></span>
                </li>
              ))}
            </ul>
          </div>
          {/* Diet Modal */}
<AnimatePresence>
  {showDietModal && (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-neutral-900 rounded-3xl p-6 w-11/12 max-w-2xl relative shadow-2xl"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">{editDiet ? "Edit Diet" : "Create Diet"}</h2>
        <form onSubmit={handleSaveDiet} className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          <input
            type="text"
            placeholder="Diet Title"
            className="bg-neutral-800 text-white p-3 rounded-xl w-full"
            value={dietTitle}
            onChange={(e) => setDietTitle(e.target.value)}
            required
          />

{meals.map((meal, i) => (
  <div key={i} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full">
    <input
      type="text"
      value={meal.name}
      onChange={(e) => handleMealChange(i, "name", e.target.value)}
      placeholder="Meal Name"
      className="flex-1 p-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white w-full"
      required
    />
    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
      <input
        type="number"
        value={meal.calories}
        onChange={(e) => handleMealChange(i, "calories", e.target.value)}
        placeholder="Calories"
        className="w-full sm:w-20 p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
        required
      />
      <input
        type="number"
        value={meal.protein}
        onChange={(e) => handleMealChange(i, "protein", e.target.value)}
        placeholder="Protein (g)"
        className="w-full sm:w-20 p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
        required
      />
      <input
        type="number"
        value={meal.carbs}
        onChange={(e) => handleMealChange(i, "carbs", e.target.value)}
        placeholder="Carbs (g)"
        className="w-full sm:w-20 p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
        required
      />
      <input
        type="number"
        value={meal.fats}
        onChange={(e) => handleMealChange(i, "fats", e.target.value)}
        placeholder="Fats (g)"
        className="w-full sm:w-20 p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
        required
      />
    </div>
    {meals.length > 1 && (
      <button type="button" onClick={() => removeMeal(i)} className="text-red-500 mt-1 sm:mt-0">X</button>
    )}
  </div>
))}


          <button
            type="button"
            onClick={addMeal}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl self-start"
          >
            + Add Meal
          </button>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl"
              onClick={() => setShowDietModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl ${loadingDiet ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loadingDiet}
            >
              {editDiet ? "Update Diet" : "Create Diet"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
        </div>
      </main>
    </div>
  )
}



