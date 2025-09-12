import React, { useState } from "react";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mealColors = {
  Breakfast: "from-yellow-400 to-yellow-500",
  Lunch: "from-green-400 to-green-500",
  Dinner: "from-orange-400 to-orange-500",
  Snacks: "from-pink-400 to-pink-500",
};

export default function DietCard({ diet, handleDeleteDiet }) {
  const [openMeals, setOpenMeals] = useState({}); // Track which meals are open

  const toggleMeal = (mealName) => {
    setOpenMeals((prev) => ({ ...prev, [mealName]: !prev[mealName] }));
  };

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
          <div key={meal._id} className="bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
            
            {/* Meal Header */}
            <div
              onClick={() => toggleMeal(meal.name)}
              className={`flex justify-between items-center cursor-pointer p-4 bg-gradient-to-r ${mealColors[meal.name] || "from-blue-400 to-blue-500"} rounded-t-2xl`}
            >
              <h3 className="font-semibold text-white text-lg">{meal.name}</h3>
              {openMeals[meal.name] ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
            </div>

            {/* Animate food items */}
            <AnimatePresence>
              {openMeals[meal.name] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 flex flex-wrap gap-2 bg-gray-700 rounded-b-2xl"
                >
                  {meal.items?.map((item) => (
                    <span
                      key={item._id}
                      className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded-full text-gray-200 text-sm flex justify-between items-center shadow-sm transition w-full sm:w-auto"
                    >
                      <span>{item.name}</span>
                      <span className="font-semibold text-green-400">{item.calories} kcal</span>
                    </span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        ))}
      </div>
    </motion.div>
  );
}
