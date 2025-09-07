// src/pages/CreateDiet.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../utils/api"; 
export default function CreateDiet() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [meals, setMeals] = useState([{ name: "", calories: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMealChange = (index, field, value) => {
    const newMeals = [...meals];
    newMeals[index][field] = field === "calories" ? Number(value) : value;
    setMeals(newMeals);
  };

  const addMeal = () => setMeals([...meals, { name: "", calories: "" }]);
  const removeMeal = (index) =>
    setMeals(meals.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await api.post(
        "/dites",
        { title, meals },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data) {
        // Redirect back to dashboard after successful creation
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Cannot create diet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800/70 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full">
        <h2 className="text-3xl text-white font-extrabold text-center mb-6">
          Create Diet Plan
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <input
            type="text"
            placeholder="Diet Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-700 text-white rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <div>
            <h3 className="text-white font-semibold mb-2">Meals</h3>
            {meals.map((meal, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  placeholder="Meal Name"
                  value={meal.name}
                  onChange={(e) =>
                    handleMealChange(index, "name", e.target.value)
                  }
                  className="bg-gray-700 text-white rounded-xl px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 flex-1"
                  required
                />
                <input
                  type="number"
                  placeholder="Calories"
                  value={meal.calories}
                  onChange={(e) =>
                    handleMealChange(index, "calories", e.target.value)
                  }
                  className="bg-gray-700 text-white rounded-xl px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 w-24"
                  required
                />
                {meals.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMeal(index)}
                    className="text-red-500 font-bold"
                  >
                    X
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addMeal}
              className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm shadow-md transition"
            >
              Add Meal
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition duration-300 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Diet"}
          </button>
        </form>
      </div>
    </div>
  );
}
