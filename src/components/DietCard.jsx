import React from "react";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DietCard({ diet, handleDeleteDiet }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-800 rounded-2xl shadow-lg p-5 flex flex-col gap-4 hover:shadow-2xl transition-shadow"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-400">{diet.title || "Daily Diet"}</h2>
        <button
          onClick={() => handleDeleteDiet(diet._id)}
          className="text-red-500 hover:text-red-600 transition"
          title="Delete Diet"
        >
          <Trash2 size={22} />
        </button>
      </div>

      {/* Nutrition Stats */}
      <div className="grid grid-cols-3 gap-4 text-center bg-gray-700 rounded-xl p-3">
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold">{diet.totalCalories || 0} kcal</span>
          <p className="text-sm text-gray-400">Calories</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold">{diet.totalProtein || 0} g</span>
          <p className="text-sm text-gray-400">Protein</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold">{diet.totalCarbs || 0} g</span>
          <p className="text-sm text-gray-400">Carbs</p>
        </div>
      </div>

      {/* Meals */}
      <div className="flex flex-col gap-3">
        {diet.meals?.map((meal) => (
          <div
            key={meal._id}
            className="bg-gray-700 rounded-xl p-3 hover:bg-gray-600 transition"
          >
            <h3 className="font-semibold text-green-300 mb-2">{meal.name}</h3>
            <ul className="list-disc list-inside text-gray-300 text-sm">
              {meal.items?.map((item) => (
                <li key={item._id}>
                  <span className="font-medium">{item.name}</span>{" "}
                  - <span className="text-gray-400">{item.calories} kcal</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
