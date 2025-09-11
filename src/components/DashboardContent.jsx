// Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Trash2, Plus } from "lucide-react";

export default function Dashboard() {
  const [diets, setDiets] = useState([]);
  const [showDietModal, setShowDietModal] = useState(false);
  const [loadingDiet, setLoadingDiet] = useState(false);

  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("sedentary");

  const [expandedMeal, setExpandedMeal] = useState(null);

  const navigate = useNavigate();

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

  // Generate diet
  const handleGenerateDiet = async (e) => {
    e.preventDefault();
    if (!age || !weight || !height || !activityLevel) {
      return alert("Please fill all fields");
    }
    setLoadingDiet(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await api.post(
        "/diets/generate",
        {
          age: Number(age),
          weight: Number(weight),
          height: Number(height),
          gender,
          activityLevel,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDiets([...diets, res.data]);
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

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-black min-h-screen text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Diet Dashboard</h1>
        <button
          onClick={() => setShowDietModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow-lg"
        >
          <Plus size={18} /> Generate Diet
        </button>
      </div>

      {/* Diet List */}
      <div className="space-y-6">
        {diets.length === 0 && (
          <p className="text-gray-400 text-center">
            No diets yet. Click <b>Generate Diet</b> to start!
          </p>
        )}

        {diets.map((diet) => (
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
