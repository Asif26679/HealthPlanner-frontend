import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import MealAccordion from "./MealAccordion";
import { motion, AnimatePresence } from "framer-motion";

const mealColors = ["from-green-400 to-green-600", "from-orange-400 to-orange-600", "from-blue-400 to-blue-600"];

export default function DietCard({ diet, handleDeleteDiet }) {
  const [expandedMeal, setExpandedMeal] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800/70 border border-gray-700 rounded-xl shadow-lg p-5 mb-6 hover:scale-105 transform transition"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{diet.title || "Diet Plan"}</h2>
        <span className="text-green-400 font-semibold">{diet.totalCalories || 0} kcal</span>
      </div>

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

      <button
        onClick={() => handleDeleteDiet(diet._id)}
        className="mt-2 flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm"
      >
        <Trash2 size={16} /> Delete Diet
      </button>
    </motion.div>
  );
}
