import React, { useState } from "react";
import axios from "axios";
import {
  Dumbbell,
  Salad,
  Droplets,
  Flame,
  Trash2,
  PlusCircle,
} from "lucide-react";

export default function Dashboard({ user }) {
  const [diet, setDiet] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateDiet = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "https://healthplanner-backend.onrender.com/api/diet/generate",
        { userId: user._id }
      );
      setDiet(res.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const clearDiet = () => setDiet(null);

  // Calculate stats
  const totalCalories =
    diet?.meals.reduce(
      (sum, meal) =>
        sum + meal.items.reduce((acc, item) => acc + item.calories, 0),
      0
    ) || 0;

  const totalMeals = diet?.meals.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6">
          Welcome, <span className="text-indigo-400">{user.username}</span> 👋
        </h1>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-gray-800/80 p-6 rounded-2xl shadow-lg flex flex-col items-center">
            <Flame className="w-8 h-8 text-orange-400 mb-2" />
            <p className="text-2xl font-bold">{totalCalories}</p>
            <p className="text-gray-400 text-sm">Total Calories</p>
          </div>
          <div className="bg-gray-800/80 p-6 rounded-2xl shadow-lg flex flex-col items-center">
            <Salad className="w-8 h-8 text-green-400 mb-2" />
            <p className="text-2xl font-bold">{totalMeals}</p>
            <p className="text-gray-400 text-sm">Meals</p>
          </div>
          <div className="bg-gray-800/80 p-6 rounded-2xl shadow-lg flex flex-col items-center">
            <Droplets className="w-8 h-8 text-blue-400 mb-2" />
            <p className="text-2xl font-bold">2.5L</p>
            <p className="text-gray-400 text-sm">Water Intake</p>
          </div>
          <div className="bg-gray-800/80 p-6 rounded-2xl shadow-lg flex flex-col items-center">
            <Dumbbell className="w-8 h-8 text-purple-400 mb-2" />
            <p className="text-2xl font-bold">3</p>
            <p className="text-gray-400 text-sm">Workouts</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={generateDiet}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition disabled:opacity-50"
          >
            <PlusCircle size={18} />
            {loading ? "Generating..." : "Generate New Diet"}
          </button>
          {diet && (
            <button
              onClick={clearDiet}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-medium transition"
            >
              <Trash2 size={18} />
              Delete Current Diet
            </button>
          )}
        </div>

        {/* Diet Plan Section */}
        {diet ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diet.meals.map((meal, index) => (
              <div
                key={index}
                className="bg-gray-800/90 border border-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-indigo-500/20 transition"
              >
                <h2 className="text-xl font-semibold mb-3 text-indigo-400">
                  {meal.type}
                </h2>
                <ul className="space-y-2 text-gray-300">
                  {meal.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between bg-gray-700/40 px-3 py-2 rounded-lg"
                    >
                      <span>{item.name}</span>
                      <span className="text-sm text-gray-400">
                        {item.calories} kcal
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg">
              No diet plan yet. Click{" "}
              <span className="text-indigo-400">Generate</span> to create one 🚀
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
