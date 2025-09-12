import React, { useState } from "react";
import { Trash2, Clock, Zap } from "lucide-react"; // Zap for calories
import { motion, AnimatePresence } from "framer-motion";

const mealColors = [
  "from-green-400 to-green-600",
  "from-orange-400 to-orange-600",
  "from-blue-400 to-blue-600",
  "from-pink-400 to-pink-600",
];

export default function DietCard({ diet, handleDeleteDiet }) {
  const [expandedMeal, setExpandedMeal] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-5 mb-6 hover:scale-[1.02] transform transition-all duration-300"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-lg sm:text-xl font-bold text-white">{diet.title || "Diet Plan"}</h2>
        <div className="flex items-center gap-2 text-green-400 font-semibold">
          <Zap size={18} /> {diet.totalCalories || 0} kcal
        </div>
      </div>

      {/* Meals */}
      <div className="space-y-3">
        {(diet.meals || []).map((meal, idx) => (
          <div
            key={idx}
            className={`rounded-xl overflow-hidden bg-gradient-to-r ${mealColors[idx % mealColors.length]} shadow-lg`}
          >
            <button
              onClick={() =>
                setExpandedMeal(expandedMeal === idx ? null : idx)
              }
              className="w-full flex justify-between items-center px-4 py-3 font-semibold text-gray-900 hover:bg-white/20 transition"
            >
              <span>{meal.name}</span>
              <div className="flex items-center gap-2">
                <Clock size={16} /> {meal.calories || 0} kcal
                {expandedMeal === idx ? (
                  <span className="ml-2">▲</span>
                ) : (
                  <span className="ml-2">▼</span>
                )}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {expandedMeal === idx && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 py-2 bg-white/10 space-y-2"
                >
                  {(meal.foods || []).map((food, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex justify-between items-center bg-white/20 px-3 py-2 rounded-lg text-white font-medium"
                    >
                      <span>{food.name}</span>
                      <span>{food.calories || 0} kcal</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Delete Button */}
      <button
        onClick={() => handleDeleteDiet(diet._id)}
        className="mt-4 flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-2xl font-semibold shadow-xl transition-all duration-300"
      >
        <Trash2 size={16} /> Delete Diet
      </button>
    </motion.div>
  );
}
