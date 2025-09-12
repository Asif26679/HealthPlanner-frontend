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
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl p-6 flex flex-col gap-6 hover:shadow-3xl transition-shadow duration-300"
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
     

      {/* Meals */}
      <div className="flex flex-col gap-5">
        {diet.meals?.map((meal) => (
          <div key={meal._id} className="bg-gray-800 rounded-2xl p-4 shadow-md hover:shadow-lg transition duration-300">
            <h3
              className={`font-semibold text-white text-lg mb-4 bg-gradient-to-r ${mealColors[meal.name] || "from-blue-400 to-blue-500"} inline-block px-4 py-1 rounded-full shadow`}
            >
              {meal.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {meal.items?.map((item) => (
                <span
                  key={item._id}
                  className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-gray-200 text-sm flex justify-between items-center shadow-sm transition"
                >
                  <span>{item.name}</span>
                  <span className="font-semibold text-green-400">{item.calories} kcal</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
