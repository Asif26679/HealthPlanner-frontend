// DietCard.jsx
import React, { useState } from "react";
import { Trash2, Clock, Coffee, Apple, Zap, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Modal to show meal details
function MealModal({ isOpen, onClose, meal }) {
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
              {(meal.foods && meal.foods.length > 0 ? meal.foods : [{ name: "No foods available", calories: 0 }]).map((food, idx) => (
                <div
                  key={idx}
                  className="flex justify-between bg-gray-800 px-4 py-2 rounded-lg"
                >
                  <span>{food?.name}</span>
                  <span>{food?.calories || 0} kcal</span>
                </div>
              ))}
            </div>

            {/* Optional macros */}
            {meal.protein || meal.carbs || meal.fat ? (
              <div className="mt-4 flex justify-between text-sm text-gray-400">
                <span>Protein: {meal.protein || 0}g</span>
                <span>Carbs: {meal.carbs || 0}g</span>
                <span>Fat: {meal.fat || 0}g</span>
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Main DietCard component
export default function DietCard({ diet, onDelete }) {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Open modal for meal
  const openMealModal = (meal) => {
    setSelectedMeal(meal);
    setModalOpen(true);
  };

  // Gradient colors per meal
  const mealGradients = [
    "bg-gradient-to-r from-yellow-400 to-yellow-500", // Breakfast
    "bg-gradient-to-r from-orange-400 to-orange-500", // Lunch
    "bg-gradient-to-r from-red-400 to-red-500",       // Dinner
    "bg-gradient-to-r from-green-400 to-green-500",   // Snacks
  ];

  // Icons per meal
  const mealIcons = [Coffee, Zap, Zap, Apple];

  return (
    <div className="bg-gray-900 rounded-2xl shadow-lg p-5 mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">{diet.title || "Diet Plan"}</h2>
        <button
          onClick={() => onDelete(diet._id)}
          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>

      {/* Total Calories */}
      <div className="mb-4 p-3 rounded-lg bg-gray-800/60 flex justify-between items-center">
        <span className="font-medium text-gray-300">Total Calories</span>
        <span className="font-bold text-white">{diet.totalCalories || 0} kcal</span>
      </div>

      {/* Meals */}
      <div className="space-y-3">
        {(diet.meals || []).map((meal, idx) => {
          const Icon = mealIcons[idx % mealIcons.length];
          const gradient = mealGradients[idx % mealGradients.length];

          return (
            <button
              key={idx}
              onClick={() => openMealModal(meal)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${gradient} text-gray-900 font-semibold hover:brightness-105 transition`}
            >
              {Icon && <Icon size={24} />}
              <div className="flex-1 text-left">
                {meal.name} - {meal.calories || 0} kcal
              </div>
              <Clock size={18} />
            </button>
          );
        })}
      </div>

      {/* Meal Modal */}
      <MealModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        meal={selectedMeal}
      />
    </div>
  );
}
