import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import MealAccordion from "./MealAccordion";
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
      className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-700 rounded-2xl shadow-xl p-5 mb-6 hover:scale-[1.02] transform transition-all duration-300"
    >
      {/* Diet Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-lg sm:text-xl font-semibold text-white">{diet.title || "Diet Plan"}</h2>
        <span className="text-sm sm:text-base font-medium text-green-400">{diet.totalCalories || 0} kcal</span>
      </div>

      {/* Meals */}
      <div className="space-y-3">
        {(diet.meals || []).map((meal, idx) => (
          <MealAccordion
            key={idx}
            meal={meal}
            expanded={expandedMeal === idx}
            toggleExpand={() =>
              setExpandedMeal(expandedMeal === idx ? null : idx)
            }
            color={mealColors[idx % mealColors.length]}
          />
        ))}
      </div>

      {/* Delete Button */}
      <button
        onClick={() => handleDeleteDiet(diet._id)}
        className="mt-4 flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium shadow-lg transition-colors duration-300"
      >
        <Trash2 size={16} /> Delete Diet
      </button>
    </motion.div>
  );
}
