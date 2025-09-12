import React, { useState } from "react";
import { Trash2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mealGradients = [
  "from-yellow-300 to-yellow-500",  // Breakfast
  "from-orange-400 to-orange-600",  // Lunch
  "from-red-400 to-red-600",        // Dinner
  "from-green-400 to-green-600",    // Snacks
];

export default function DietCard({ diet, handleDeleteDiet }) {
  const [expandedMeal, setExpandedMeal] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-3xl shadow-2xl p-6 mb-6 max-w-md mx-auto hover:scale-[1.02] transition-transform duration-300"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{diet.title || "Diet Plan"}</h2>
        <div className="flex items-center gap-2 text-yellow-400 font-semibold">
          <Clock size={18} /> {diet.totalCalories || 0} kcal
        </div>
      </div>

      {/* Meals List */}
      <div className="space-y-4">
        {(diet.meals || []).map((meal, idx) => (
          <div key={idx} className="rounded-2xl overflow-hidden shadow-lg">
            {/* Meal Header */}
            <button
              onClick={() => setExpandedMeal(expandedMeal === idx ? null : idx)}
              className={`w-full px-4 py-3 flex justify-between items-center font-semibold text-gray-900 bg-gradient-to-r ${mealGradients[idx % mealGradients.length]} hover:brightness-110 transition`}
            >
              <span className="text-white">{meal.name}</span>
              <div className="flex items-center gap-2 text-white">
                {meal.calories || 0} kcal
                <span>{expandedMeal === idx ? "▲" : "▼"}</span>
              </div>
            </button>

            {/* Foods */}
            <AnimatePresence>
              {expandedMeal === idx && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 py-3 bg-gray-800/70 space-y-2 rounded-b-2xl"
                >
                  {(meal.foods || []).map((food, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex justify-between items-center bg-gray-700/50 px-3 py-2 rounded-xl text-white"
                    >
                      <span>{food.name}</span>
                      <span>{food.calories || 0} kcal</span>
                    </div>
                  ))}

                  {/* Optional Macros */}
                  <div className="flex justify-between text-sm text-gray-300 mt-2">
                    <span>Protein: {meal.protein || 0}g</span>
                    <span>Carbs: {meal.carbs || 0}g</span>
                    <span>Fat: {meal.fat || 0}g</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Delete Button */}
      <button
        onClick={() => handleDeleteDiet(diet._id)}
        className="mt-5 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-2xl font-semibold shadow-lg transition-all duration-300"
      >
        <Trash2 size={16} /> Delete Diet
      </button>
    </motion.div>
  );
}
