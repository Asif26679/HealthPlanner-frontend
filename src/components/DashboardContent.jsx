// Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Trash2,
  Plus,
  LogOut,
  User,
  Activity,
  Flame,
} from "lucide-react";

export default function Dashboard() {
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
      <aside className="w-64 bg-gray-900 flex flex-col justify-between p-6">
        <div>
          <h2 className="text-xl font-bold mb-6 text-purple-400">Dashboard</h2>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium transition"
          >
            <Plus size={18} />
            {loading ? "Generating..." : "New Diet Plan"}
          </button>
        </div>

        {/* Bottom section */}
        <div className="mt-10 border-t border-gray-800 pt-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-6 h-6 text-purple-400" />
            <span className="text-sm font-medium">{user?.name || "User"}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Activity className="w-7 h-7 text-purple-500" />
          Daily Diet Plans
        </h1>

        {diets.length === 0 ? (
          <p className="text-gray-400">No diet plans yet. Generate one!</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {diets.map((diet) => (
              <div
                key={diet._id}
                className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800 hover:border-purple-500 transition flex flex-col"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-lg">{diet.name || "Diet Plan"}</h2>
                  <button
                    onClick={() => handleDelete(diet._id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="text-sm text-gray-400 flex items-center gap-2 mb-6">
                  <Flame className="w-4 h-4 text-orange-400" />
                  {diet.totalCalories || 0} kcal
                </div>

                {/* Meals always visible */}
                <div className="space-y-4 flex-1">
                  {(diet?.meals || []).map((meal, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800/50 rounded-xl p-4"
                    >
                      <h3 className="font-medium mb-3">{meal?.name || `Meal ${idx + 1}`}</h3>
                      <div className="space-y-2">
                        {(meal?.foods || []).map((food, fIdx) => (
                          <div
                            key={fIdx}
                            className="flex justify-between text-sm bg-gray-900/60 px-3 py-2 rounded-lg"
                          >
                            <span>{food?.name || "Food"}</span>
                            <span className="text-gray-400">{food?.calories || 0} kcal</span>
                          </div>
                        ))}
                      </div>
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





