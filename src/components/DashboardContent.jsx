import React, { useEffect, useState, useRef } from "react";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Menu,
  X,
  LogOut,
  User,
  Utensils,
  Flame,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  const [diets, setDiets] = useState([]);
  const [loadingDiet, setLoadingDiet] = useState(false);
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("sedentary");

  const navigate = useNavigate();
  const { user } = useAuth();
  const sidebarRef = useRef(null);

  // Fetch diets
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await api.get("/diets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDiets(res.data || []);
      } catch (err) {
        console.error("Error fetching diets:", err);
      }
    };
    fetchData();
  }, [navigate]);

  // Click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  const handleGenerateDiet = async (e) => {
    e.preventDefault();
    if (!age || !weight || !height || !activityLevel) return alert("Please fill all fields");
    setLoadingDiet(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      for (let d of diets) {
        await api.delete(`/diets/${d._id}`, { headers: { Authorization: `Bearer ${token}` } });
      }

      const res = await api.post(
        "/diets/generate",
        { age: Number(age), weight: Number(weight), height: Number(height), gender, activityLevel },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDiets([res.data]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error generating diet");
    } finally {
      setLoadingDiet(false);
    }
  };

  const handleDeleteDiet = async (id) => {
    if (!window.confirm("Delete this diet?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/diets/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setDiets(diets.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const mealColors = ["from-green-400 to-green-600", "from-orange-400 to-orange-600", "from-blue-400 to-blue-600"];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pt-20 relative">

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-800/95 backdrop-blur-lg shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-50 flex flex-col justify-between`}
      >
        {/* Generate Diet Form */}
        <div className="p-6 overflow-y-auto space-y-5 mt-20 md:mt-0">
          <h2 className="text-xl font-bold mb-2 text-center text-green-400">Generate Daily Diet</h2>
          <form onSubmit={handleGenerateDiet} className="space-y-3">
            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" required />
            <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" required />
            <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" required />
            <select value={gender} onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400">
              <option value="sedentary">Sedentary</option>
              <option value="lightly">Lightly Active</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very">Very Active</option>
            </select>
            <button type="submit" disabled={loadingDiet}
              className="bg-gradient-to-r from-green-400 to-green-600 w-full py-2 rounded-lg font-semibold shadow-lg hover:from-green-500 hover:to-green-700 transition">
              {loadingDiet ? "Generating..." : "Generate"}
            </button>
          </form>
        </div>

        {/* Bottom Sidebar - User Info */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <User className="text-gray-300" />
            <span className="font-semibold">{user?.name || "User"}</span>
          </div>
          <Link to="/profile"
            className="flex items-center gap-2 mb-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg w-full justify-center transition">
            Edit Profile
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg w-full justify-center transition">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:ml-64">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden mb-4 p-2 bg-gray-800 rounded-lg shadow"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Header */}
        <h1 className="text-3xl font-bold mb-8">
          👋 Hello, <span className="text-green-400">{user?.name || "User"}</span>
        </h1>

        {/* Stats */}
        {diets.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-5 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-xl shadow-lg flex items-center gap-4">
              <Flame size={28} />
              <div>
                <p className="text-sm text-gray-900">Total Calories</p>
                <h2 className="text-xl font-bold">{diets[0]?.totalCalories || 0} kcal</h2>
              </div>
            </div>
            <div className="p-5 bg-gradient-to-r from-green-400 to-green-600 rounded-xl shadow-lg flex items-center gap-4">
              <Utensils size={28} />
              <div>
                <p className="text-sm text-gray-900">Meals</p>
                <h2 className="text-xl font-bold">{diets[0]?.meals?.length || 0}</h2>
              </div>
            </div>
            <div className="p-5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl shadow-lg flex items-center gap-4">
              <Activity size={28} />
              <div>
                <p className="text-sm text-gray-900">Activity</p>
                <h2 className="text-xl font-bold">{activityLevel}</h2>
              </div>
            </div>
          </div>
        )}

        {/* Diet List */}
        <div className="grid md:grid-cols-2 gap-6">
          {diets.length === 0 && (
            <div className="col-span-full text-center text-gray-400">
              No diets yet. Use the form on the left to generate a diet!
            </div>
          )}
          {diets.map((diet) => (
            <div key={diet._id} className="bg-gray-800/70 border border-gray-700 rounded-xl shadow-lg p-5 mb-6 hover:scale-105 transform transition">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{diet.title || "Diet Plan"}</h2>
                <span className="text-green-400 font-semibold">{diet.totalCalories || 0} kcal</span>
              </div>

              {(diet.meals || []).map((meal, idx) => (
                <div key={idx} className={`mb-4 rounded-lg overflow-hidden bg-gradient-to-r ${mealColors[idx % mealColors.length]} shadow-md`}>
                  <button
                    onClick={() => setExpandedMeal(expandedMeal === idx ? null : idx)}
                    className="w-full flex justify-between items-center px-4 py-2 font-medium text-gray-900"
                  >
                    <span>{meal?.name || `Meal ${idx + 1}`}</span>
                    <span>{meal?.calories || 0} kcal</span>
                    {expandedMeal === idx ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  {expandedMeal === idx && (
                    <div className="px-4 py-2 space-y-2 text-gray-900">
                      {(meal.foods || []).map((food, fIdx) => (
                        <div key={fIdx} className="flex justify-between bg-gray-100/20 px-3 py-2 rounded-lg">
                          <span>{food?.name}</span>
                          <span>{food?.calories || 0} kcal</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button onClick={() => handleDeleteDiet(diet._id)}
                className="mt-2 flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm">
                <Trash2 size={16} /> Delete Diet
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}







