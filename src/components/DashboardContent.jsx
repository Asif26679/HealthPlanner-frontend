// Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  Menu,
  X,
  LogOut,
  User,
  Utensils,
  Flame,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [diets, setDiets] = useState([]);
  const [expandedDiet, setExpandedDiet] = useState(null);
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch diets
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await api.get("/diets", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Diet API Response:", res.data); // 🔍 Debug
        setDiets(res.data || []);
      } catch (err) {
        console.error("Error fetching diets:", err);
      }
    };
    fetchData();
  }, [navigate]);

  // Generate diet
  const generateDiet = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/diets/generate",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDiets((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Error generating diet:", err);
    }
  };

  // Delete diet
  const deleteDiet = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/diets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiets((prev) => prev.filter((diet) => diet._id !== id));
    } catch (err) {
      console.error("Error deleting diet:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-gray-900 shadow-lg sticky top-0 z-50">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Utensils className="w-6 h-6 text-green-400" />
          HealthPlanner
        </h1>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 px-3 py-2 rounded-lg hover:bg-red-700"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 bg-gray-800 rounded-lg"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 p-4 flex flex-col gap-3 shadow-lg">
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 px-3 py-2 rounded-lg hover:bg-red-700"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="p-6 max-w-6xl mx-auto">
        {/* Generate button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={generateDiet}
            className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg shadow-md hover:bg-green-700"
          >
            <Plus size={18} /> Generate Diet
          </button>
        </div>

        {/* Diets list */}
        <div className="grid md:grid-cols-2 gap-6">
          {(diets || []).map((diet, dietIdx) => (
            <div
              key={diet._id || dietIdx}
              className="bg-gray-800/70 p-4 rounded-2xl shadow-lg hover:shadow-xl transition"
            >
              {/* Diet header */}
              <button
                onClick={() =>
                  setExpandedDiet(expandedDiet === dietIdx ? null : dietIdx)
                }
                className="w-full flex justify-between items-center font-semibold text-lg"
              >
                <span className="flex items-center gap-2">
                  <Flame className="text-orange-400" />
                  {diet?.title || `Diet ${dietIdx + 1}`}
                </span>
                {expandedDiet === dietIdx ? <ChevronUp /> : <ChevronDown />}
              </button>

              {/* Diet content */}
              {expandedDiet === dietIdx && (
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Activity size={14} /> {diet?.calories || 0} kcal
                    </span>
                    <button
                      onClick={() => deleteDiet(diet._id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>

                  {/* Meals */}
                  {(diet?.meals ?? []).length > 0 ? (
                    (diet.meals || []).map((meal, mealIdx) => (
                      <div
                        key={mealIdx}
                        className="mt-4 bg-gray-700/50 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setExpandedMeal(
                              expandedMeal === `${dietIdx}-${mealIdx}`
                                ? null
                                : `${dietIdx}-${mealIdx}`
                            )
                          }
                          className="w-full flex justify-between items-center px-4 py-2 font-medium hover:bg-gray-700"
                        >
                          <span>{meal?.name || `Meal ${mealIdx + 1}`}</span>
                          <div className="flex items-center gap-2">
                            <span>{meal?.calories || 0} kcal</span>
                            {expandedMeal === `${dietIdx}-${mealIdx}` ? (
                              <ChevronUp />
                            ) : (
                              <ChevronDown />
                            )}
                          </div>
                        </button>

                        {expandedMeal === `${dietIdx}-${mealIdx}` && (
                          <div className="px-4 py-2 space-y-2 text-sm text-gray-300">
                            {(meal?.foods || []).map((food, foodIdx) => (
                              <div
                                key={foodIdx}
                                className="flex justify-between bg-gray-800/30 px-3 py-2 rounded-lg"
                              >
                                <span>{food?.name || "Food Item"}</span>
                                <span>{food?.calories || 0} kcal</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm mt-2">
                      No meals found for this diet.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}




