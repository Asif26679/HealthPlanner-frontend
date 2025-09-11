// Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";

export default function Dashboard() {
  const [diets, setDiets] = useState([]);
  const [showDietModal, setShowDietModal] = useState(false);
  const [loadingDiet, setLoadingDiet] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("sedentary");

  const [expandedMeal, setExpandedMeal] = useState(null);

  const navigate = useNavigate();
  const userName = localStorage.getItem("username") || "Guest";

  // Fetch diets
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
        console.error("Error fetching diets:", err);
      }
    };

    fetchDiets();
  }, [navigate]);

  // Generate diet (delete old → save new)
  const handleGenerateDiet = async (e) => {
    e.preventDefault();
    if (!age || !weight || !height || !activityLevel) {
      return alert("Please fill all fields");
    }
    setLoadingDiet(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      // ✅ delete previous diets before creating new one
      if (diets.length > 0) {
        await api.delete(`/diets/${diets[0]._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      const res = await api.post(
        "/diets/generate",
        { age: +age, weight: +weight, height: +height, gender, activityLevel },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDiets([res.data]); // ✅ replace instead of appending
      setShowDietModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error generating diet");
    } finally {
      setLoadingDiet(false);
    }
  };

  // Delete diet manually
  const handleDeleteDiet = async (id) => {
    if (!window.confirm("Delete this diet?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/diets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiets([]);
    } catch (err) {
      console.error(err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 bg-gray-800 w-64 h-full p-6 transition-transform shadow-lg ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-green-400">HealthPlanner</h2>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-green-600 rounded-full p-2">
            <User size={20} />
          </div>
          <div>
            <p className="font-semibold">{userName}</p>
            <p className="text-xs text-gray-400">Active Member</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="block w-full text-left px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-500 px-4 py-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:ml-64">
        {/* Mobile Top Bar */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </div>

        {/* Welcome + Generate */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold">👋 Hello, {userName}</h1>
          <button
            onClick={() => setShowDietModal(true)}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg shadow-lg w-full md:w-auto"
          >
            <Plus size={18} /> Generate New Diet
          </button>
        </div>

        {/* Diet Section */}
        <div className="space-y-6">
          {diets.length === 0 ? (
            <p className="text-gray-400 text-center">
              No diet yet. Click <b>Generate New Diet</b> to start!
            </p>
          ) : (
            diets.map((diet) => (
              <div
                key={diet._id}
                className="bg-gray-800/70 border border-gray-700 rounded-xl shadow-lg p-5"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{diet.title}</h2>
                    <p className="text-sm text-gray-400">
                      Total Calories: {diet.totalCalories || 0}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteDiet(diet._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Meals Accordion */}
                <div className="space-y-3">
                  {(diet.meals || []).map((meal, idx) => (
                    <div key={idx} className="bg-gray-700 rounded-lg">
                      <button
                        onClick={() =>
                          setExpandedMeal(expandedMeal === idx ? null : idx)
                        }
                        className="w-full flex justify-between items-center px-4 py-3"
                      >
                        <span className="font-medium">{meal.name}</span>
                        <span className="text-sm text-gray-300">
                          {meal.calories} kcal
                        </span>
                        {expandedMeal === idx ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>

                      {expandedMeal === idx && (
                        <div className="px-4 pb-3 space-y-2 text-sm text-gray-300">
                          <p>
                            Protein: {meal.protein}g | Carbs: {meal.carbs}g |
                            Fats: {meal.fats}g
                          </p>
                          <ul className="list-disc ml-5 space-y-1">
                            {(meal.foods || []).map((food, fIdx) => (
                              <li key={fIdx}>
                                {food.name} ({food.calories} kcal)
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Diet Modal */}
      {showDietModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Generate New Diet</h2>
            <form onSubmit={handleGenerateDiet} className="space-y-3">
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded"
                required
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded"
                required
              />
              <input
                type="number"
                placeholder="Height (cm)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded"
                required
              />

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded"
              >
                <option value="sedentary">Sedentary</option>
                <option value="lightly">Lightly Active</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very">Very Active</option>
              </select>

              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  disabled={loadingDiet}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                >
                  {loadingDiet ? "Generating..." : "Generate"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDietModal(false)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
