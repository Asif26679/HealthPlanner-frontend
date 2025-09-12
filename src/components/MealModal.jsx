import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function MealModal({ isOpen, onClose, meal }) {
  return (
    <AnimatePresence>
      {isOpen && meal && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 text-white rounded-3xl p-6 w-11/12 max-w-lg shadow-xl relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-4">{meal.name}</h2>
            <p className="mb-4 font-medium text-gray-300">
              Total Calories: {meal.calories || 0} kcal
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {(meal.foods || []).map((food, idx) => (
                <div
                  key={idx}
                  className="flex justify-between bg-gray-800 px-4 py-2 rounded-lg"
                >
                  <span>{food.name}</span>
                  <span>{food.calories || 0} kcal</span>
                </div>
              ))}
            </div>

            {/* Optional: Macros */}
            <div className="mt-4 flex justify-between text-sm text-gray-400">
              <span>Protein: {meal.protein || 0}g</span>
              <span>Carbs: {meal.carbs || 0}g</span>
              <span>Fat: {meal.fat || 0}g</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
