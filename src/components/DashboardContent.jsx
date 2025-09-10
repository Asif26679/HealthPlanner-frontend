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
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");

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
        const res = await api.get("/diets", { headers: { Authorization: `Bearer ${token}` } });
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
    const millisTillMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
    const timer = setTimeout(() => setWater(0), millisTillMidnight);
    return () => clearTimeout(timer);
  }, [water]);

  // Meal handlers
  const handleMealChange = (index, field, value) => {
    const updated = [...meals];
    updated[index][field] = ["calories", "protein", "carbs", "fats"].includes(field) ? Number(value) : value;
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

  // Save diet (manual)
  const handleSaveDiet = async (e) => {
    e.preventDefault();
    setLoadingDiet(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editDiet) {
        const res = await api.put(`/diets/${editDiet._id}`, { title: dietTitle, meals }, config);
        setDiets(diets.map((d) => (d._id === res.data._id ? res.data : d)));
      } else {
        const res = await api.post("/diets", { title: dietTitle, meals }, config);
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

  // Auto-generate diet
  const handleGenerateDiet = async () => {
    if (!age || !weight || !height || !activityLevel) {
      return alert("Please fill all fields for auto-generation.");
    }
    setLoadingDiet(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await api.post("/diets/generate", {
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
        activityLevel,
      }, { headers: { Authorization: `Bearer ${token}` } });

      setDiets([...diets, res.data]);
      setShowDietModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error generating diet");
    } finally {
      setLoadingDiet(false);
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

  const toggleCollapseDiet = (id) => {
    setCollapsedDiets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-950 text-white">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-neutral-950 border-r border-neutral-800 flex-col justify-between py-6 px-4 shadow-xl">
        <nav className="space-y-3 mt-10">
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
              <div className="flex gap-2">
                <button onClick={openCreateModal} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition">New Diet</button>
                <button onClick={handleGenerateDiet} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md transition">Auto-Generate</button>
              </div>
            </div>

            {diets.length === 0 ? (
              <p className="text-gray-400 mt-4">No diets yet. Create or auto-generate one!</p>
            ) : (
              diets.map((diet) => {
                const totals = calculateTotalMacros(diet.meals);
                const collapsed = collapsedDiets[diet._id];
                return (
                  <div key={diet._id} className="border-b border-neutral-700 py-3">
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleCollapseDiet(diet._id)}>
                      <h3 className="text-lg font-medium">{diet.title}</h3>
                      <span className="text-gray-400">{collapsed ? "+" : "-"}</span>
                    </div>
                    {!collapsed && (
                      <div className="mt-2">
                        {diet.meals.map((meal, i) => (
                          <div key={i} className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-2">
                              {getMealIcon(meal.name)}
                              <span>{meal.name}</span>
                              <HighCalBadge calories={meal.calories} />
                            </div>
                            <span className="text-gray-300">{meal.calories} kcal</span>
                          </div>
                        ))}
                        <div className="mt-2 text-gray-300 text-sm">
                          Total Protein: {totals.protein}g | Carbs: {totals.carbs}g | Fats: {totals.fats}g
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => openEditModal(diet)} className="text-blue-400 hover:underline text-sm">Edit</button>
                          <button onClick={() => handleDeleteDiet(diet._id)} className="text-red-400 hover:underline text-sm">Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Workouts */}
          <div className="bg-neutral-900 rounded-3xl shadow-2xl p-6 border border-neutral-800">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-red-400"><Dumbbell /> Workouts</h2>
            {workouts.map((w) => (
              <div key={w._id} className="mt-2 flex justify-between items-center border-b border-neutral-700 pb-2">
                <span>{w.title}</span>
                <span className="text-gray-300">{w.caloriesBurned} kcal</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Diet Modal */}
      <AnimatePresence>
        {showDietModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-neutral-900 rounded-3xl p-6 w-full max-w-xl overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-xl font-semibold mb-4">{editDiet ? "Edit Diet" : "New Diet"}</h2>
              <form onSubmit={handleSaveDiet} className="space-y-4">
                <input
                  type="text"
                  placeholder="Diet Title"
                  className="w-full p-2 rounded-md bg-neutral-800 text-white"
                  value={dietTitle}
                  onChange={(e) => setDietTitle(e.target.value)}
                  required
                />

                {/* Meals */}
                {meals.map((meal, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" placeholder="Meal Name" value={meal.name} onChange={(e) => handleMealChange(i, "name", e.target.value)} className="flex-1 p-2 rounded-md bg-neutral-800 text-white" />
                    <input type="number" placeholder="Calories" value={meal.calories} onChange={(e) => handleMealChange(i, "calories", e.target.value)} className="w-20 p-2 rounded-md bg-neutral-800 text-white" />
                    <button type="button" onClick={() => removeMeal(i)} className="text-red-400">X</button>
                  </div>
                ))}
                <button type="button" onClick={addMeal} className="text-blue-400">+ Add Meal</button>

                {/* Auto-generate fields */}
                {!editDiet && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className="p-2 rounded-md bg-neutral-800 text-white" />
                    <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} className="p-2 rounded-md bg-neutral-800 text-white" />
                    <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} className="p-2 rounded-md bg-neutral-800 text-white" />
                    <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} className="p-2 rounded-md bg-neutral-800 text-white">
                      <option value="">Activity Level</option>
                      <option value="sedentary">Sedentary</option>
                      <option value="lightly">Lightly Active</option>
                      <option value="moderate">Moderate</option>
                      <option value="active">Active</option>
                      <option value="very">Very Active</option>
                    </select>
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  {!editDiet && (
                    <button type="button" onClick={handleGenerateDiet} disabled={loadingDiet} className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md">
                      {loadingDiet ? "Generating..." : "Auto-Generate"}
                    </button>
                  )}
                  <button type="submit" disabled={loadingDiet} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md">
                    {loadingDiet ? "Saving..." : "Save Diet"}
                  </button>
                  <button type="button" onClick={() => setShowDietModal(false)} className="bg-neutral-700 hover:bg-neutral-800 px-4 py-2 rounded-md">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


