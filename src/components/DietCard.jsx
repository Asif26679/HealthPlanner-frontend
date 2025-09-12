import React, { useState } from "react";
import { Trash2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mealColors = [
  "bg-[#FFD97D] text-gray-900", // Breakfast
  "bg-[#FF8F70] text-gray-900", // Lunch
  "bg-[#B38AFF] text-gray-900", // Dinner
  "bg-[#70E1F5] text-gray-900", // Snacks
];

export default function DietCard({ diet, handleDeleteDiet }) {
  const [expandedMeal, setExpandedMeal] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900 rounded-3xl shadow-2xl p-6 mb-6 max-w-md mx-auto hover:scale-[1.02] transition-transform duration-300"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{diet.title || "Diet Plan"}</h2>
        <div className="flex items-center gap-2 text-white/80 font-semibold">
          <Clock size={18} /> {diet.totalCalories || 0} kcal
        </div>
      </div>

      {/* Meals */}
      <div className="space-y-4">
        {(diet.meals || []).map((meal, idx) => (
          <div key={idx} className="rounded-2xl overflow-hidden shadow-lg">
            {/* Meal Header */}
            <button
              onClick={() =>
                setExpandedMeal(expandedMeal === idx ? null : idx)
              }
              className={`w-full px-4 py-3 flex justify-between items-center font-semibold ${mealColors[idx % mealColors.length]} hover:brightness-105 transition rounded-t-2xl`}
            >
              <span>{meal.name}</span>
              <div className="flex items-center gap-2">
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
                      className="flex justify-between items-center bg-gray-700/50 px-3 py-2 rounded-lg text-white font-medium"
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
