import React from "react";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const mealColors = {
  Breakfast: "from-yellow-400 to-yellow-500",
  Lunch: "from-green-400 to-green-500",
  Dinner: "from-orange-400 to-orange-500",
  Snacks: "from-pink-400 to-pink-500",
};

export default function DietCard({ diet, handleDeleteDiet }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-900 rounded-3xl shadow-2xl p-6 flex flex-col gap-5 hover:shadow-3xl transition-shadow"
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

      {/* Total Nutrition */}
      <div className="grid grid-cols-3 gap-4 text-center bg-gray-800 rounded-2xl p-4">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">{diet.totalCalories || 0} kcal</span>
          <p className="text-sm text-gray-400">Calories</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">{diet.totalProtein || 0} g</span>
          <p className="text-sm text-gray-400">Protein</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">{diet.totalCarbs || 0} g</span>
          <p className="text-sm text-gray-400">Carbs</p>
        </div>
      </div>

      {/* Meals */}
      <div className="flex flex-col gap-4">
        {diet.meals?.map((meal) => (
          <div key={meal._id} className="bg-gray-800 rounded-2xl p-4">
            <h3
              className={`font-semibold text-white text-lg mb-3 bg-gradient-to-r ${mealColors[meal.name] || "from-blue-400 to-blue-500"} inline-block px-3 py-1 rounded-full`}
            >
              {meal.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {meal.items?.map((item) => (
                <span
                  key={item._id}
                  className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-gray-200 text-sm flex items-center gap-1"
                  title={`${item.name} - ${item.calories} kcal`}
                >
                  {item.name} ({item.calories} kcal)
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
