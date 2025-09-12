import React, { useState } from "react";
import { Trash2, Clock, Coffee, Apple, Meat, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mealColors = [
  "from-yellow-400 to-yellow-500", // Breakfast
  "from-orange-400 to-orange-500", // Lunch
  "from-red-400 to-red-500",       // Dinner
  "from-green-400 to-green-500",   // Snacks
];

export default function DietCard({ diet, handleDeleteDiet }) {
  const [expandedMeal, setExpandedMeal] = useState(null);

  const getMealIcon = (name) => {
    name = name.toLowerCase();
    if (name.includes("breakfast")) return <Coffee size={20} />;
    if (name.includes("lunch")) return <Apple size={20} />;
    if (name.includes("dinner")) return <Meat size={20} />;
    return <Zap size={20} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-5 mb-6 hover:scale-[1.02] transition-all duration-300"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-xl font-bold text-white">{diet.title || "Diet Plan"}</h2>
        <div className="flex items-center gap-2 text-green-400 font-semibold">
          <Zap size={18} /> {diet.totalCalories || 0} kcal
        </div>
      </div>

      {/* Meals */}
      <div className="space-y-3">
        {(diet.meals || []).map((meal, idx) => (
          <div
            key={idx}
            className={`rounded-2xl overflow-hidden bg-gradient-to-r ${mealColors[idx % mealColors.length]} shadow-lg`}
          >
            <button
              onClick={() =>
                setExpandedMeal(expandedMeal === idx ? null : idx)
              }
              className="w-full flex justify-between items-center px-4 py-3 font-semibold text-gray-900 hover:bg-white/20 transition"
            >
              <div className="flex items-center gap-2">
                {getMealIcon(meal.name)}
                <span>{meal.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} /> {meal.calories || 0} kcal
                {expandedMeal === idx ? (
                  <span className="ml-2">▲</span>
                ) : (
                  <span className="ml-2">▼</span>
                )}
              </div>
            </button>

            {/* Food List */}
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

                  {/* Optional: macros */}
                  <div className="flex justify-between text-sm text-gray-200 mt-1">
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
        className="mt-4 flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-2xl font-semibold shadow-xl transition-all duration-300"
      >
        <Trash2 size={16} /> Delete Diet
      </button>
    </motion.div>
  );
}
