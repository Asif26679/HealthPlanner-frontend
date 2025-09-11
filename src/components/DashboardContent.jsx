// Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Plus,
  Trash2,
  User,
  LogOut,
  Flame,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/diets/generate",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDiets([res.data, ...diets]);
    } catch (err) {
      console.error("Error generating diet:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/diets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiets(diets.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Error deleting diet:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-gray-900 p-6 justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6 text-purple-400">Diet Dashboard</h2>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition"
          >
            <Plus size={18} />
            {loading ? "Generating..." : "New Diet"}
          </button>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="text-purple-400" />
            <span>{user?.name || "User"}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome, <span className="text-purple-400">{user?.name || "User"}</span>
          </h1>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition md:hidden"
          >
            <Plus size={18} />
            {loading ? "Generating..." : "New Diet"}
          </button>
        </header>

        {/* Stats */}
        {diets.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 rounded-xl p-5 flex items-center gap-3 shadow">
              <Flame className="text-orange-400" size={28} />
              <div>
                <p className="text-gray-400 text-sm">Calories</p>
                <h2 className="font-bold">{diets[0].totalCalories} kcal</h2>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-5 flex items-center gap-3 shadow">
              <Activity className="text-blue-400" size={28} />
              <div>
                <p className="text-gray-400 text-sm">Meals</p>
                <h2 className="font-bold">{diets[0].meals?.length || 0}</h2>
              </div>
            </div>
          </div>
        )}

        {/* Diets */}
        {diets.length === 0 ? (
          <p className="text-gray-400 text-center">No diets yet. Generate one!</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {diets.map((diet) => (
              <div
                key={diet._id}
                className="bg-gray-900 rounded-2xl p-6 shadow border border-gray-800 flex flex-col"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">{diet.name || "Diet Plan"}</h3>
                  <button
                    onClick={() => handleDelete(diet._id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <p className="text-sm text-gray-400 mb-4">
                  Total Calories: {diet.totalCalories} kcal
                </p>

                {/* Meals */}
                <div className="space-y-3">
                  {(diet.meals || []).map((meal, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800 rounded-lg p-3 text-sm"
                    >
                      <h4 className="font-medium mb-2">{meal?.name || `Meal ${idx + 1}`}</h4>
                      <ul className="space-y-1">
                        {(meal.foods || []).map((food, fIdx) => (
                          <li
                            key={fIdx}
                            className="flex justify-between text-gray-300"
                          >
                            <span>{food?.name}</span>
                            <span className="text-gray-400">{food?.calories} kcal</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}





