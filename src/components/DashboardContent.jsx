// Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
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
  const [diets, setDiets] = useState([]);
  const [showDietModal, setShowDietModal] = useState(false);
  const [loadingDiet, setLoadingDiet] = useState(false);
  const [expandedMeal, setExpandedMeal] = useState(null);

  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("sedentary");

  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch diets + user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const resUser = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(resUser.data);

        const res = await api.get("/diets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDiets(res.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [navigate]);

  // Generate diet (delete old first)
  const handleGenerateDiet = async (e) => {
    e.preventDefault();
    if (!age || !weight || !height || !activityLevel) {
      return alert("Please fill all fields");
    }
    setLoadingDiet(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      // delete old diets
      for (let d of diets) {
        await api.delete(`/diets/${d._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      const res = await api.post(
        "/diets/generate",
        { age: Number(age), weight: Number(weight), height: Number(height), gender, activityLevel },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDiets([res.data]); // keep only latest
      setShowDietModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error generating diet");
    } finally {
      setLoadingDiet(false);
    }
  };

  // Delete diet
  const handleDeleteDiet = async (id) => {
    if (!window.confirm("Delete this diet?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/diets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiets(diets.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-800/90 backdrop-blur-lg shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-40`}
      >
        <div className="p-6 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-green-400">HealthPlanner</h2>
          <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
            <User className="text-gray-300" />
            <span>{user?.username || "User"}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:ml-0 ml-0">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden mb-4 p-2 bg-gray-800 rounded-lg"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            👋 Hello, <span className="text-green-400">{user?.username || "User"}</span>
          </h1>
          <button
            onClick={() => setShowDietModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow-lg transition"
          >
            <Plus size={18} /> Generate Diet
          </button>
        </div>

        {/* Stats Section */}
        {diets.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-5 bg-gray-800/60 rounded-xl backdrop-blur-lg shadow-lg flex items-center gap-4">
              <Flame className="text-orange-400" size={28} />
              <div>
                <p className="text-sm text-gray-400">Total Calories</p>
                <h2 className="text-xl font-bold">{diets[0].totalCalories || 0} kcal</h2>
              </div>
            </div>
            <div className="p-5 bg-gray-800/60 rounded-xl backdrop-blur-lg shadow-lg flex items-center gap-4">
              <Utensils className="text-green-400" size={28} />
              <div>
                <p className="text-sm text-gray-400">Meals</p>
                <h2 className="text-xl font-bold">{diets[0].meals?.length || 0}</h2>
              </div>
            </div>
            <div className="p-5 bg-gray-800/60 rounded-xl backdrop-blur-lg shadow-lg flex items-center gap-4">
              <Activity className="text-blue-400" size={28} />
              <div>
                <p className="text-sm text-gray-400">Activity</p>
                <h2 className="text-xl font-bold">{activityLevel}</h2>
              </div>
            </div>
          </div>
        )}

        {/* Diet List */}
        <div className="grid md:grid-cols-2 gap-6">
          {diets.length === 0 && (
            <div className="col-span-full text-center text-gray-400">
              No diets yet. Click <b>Generate Diet</b> to start!
            </div>
          )}

          {diets.map((diet) => (
            <div
              key={diet._id}
              className="bg-gray-800/70 border border-gray-700 rounded-xl shadow-lg p-5 hover:scale-[1.02] transition"
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
                  className="text-red-500 hover:text-red-600 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Meals Accordion */}
              <div className="space-y-3">
                {(diet.meals || []).map((meal, idx) => (
                  <div key={idx} className="bg-gray-700/50 rounded-lg overflow-hidden">
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
                      <div className="px-4 pb-3 space-y-2 text-sm text-gray-300 animate-fadeIn">
                        <p>
                          Protein: {meal.protein}g | Carbs: {meal.carbs}g | Fats:{" "}
                          {meal.fats}g
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
          ))}
        </div>
      </div>

      {/* Diet Modal */}
      {showDietModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Generate Diet</h2>
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
