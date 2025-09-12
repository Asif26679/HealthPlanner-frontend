// DietCard.jsx
import React, { useState } from "react";
import { Trash2, ChevronDown, ChevronUp, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';

export default function DietCard({ diet, handleDeleteDiet }) {
  const [openMeals, setOpenMeals] = useState({});

  const toggleMeal = (mealName) => {
    setOpenMeals((prev) => ({ ...prev, [mealName]: !prev[mealName] }));
  };

  const mealColors = {
    Breakfast: "from-yellow-400 to-yellow-600",
    Lunch: "from-green-400 to-green-600",
    Dinner: "from-blue-400 to-blue-600",
    Snacks: "from-pink-400 to-pink-600",
  };

  const nutritionTotal = diet.totalCalories || 0;

  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col gap-6 border border-gray-700 hover:border-green-400 transition-all">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-400">{diet.title || "Daily Diet"}</h2>
        <button
          onClick={() => handleDeleteDiet(diet._id)}
          className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-700 transition"
        >
          <Trash2 size={22} />
        </button>
      </div>

      {/* Total Nutrition */}
      <div className="flex justify-around items-center gap-4">
        <div style={{ width: 70, height: 70 }}>
          <CircularProgressbar
            value={diet.totalCalories}
            maxValue={2500}
            text={`${diet.totalCalories} kcal`}
            styles={buildStyles({
              pathColor: "#FACC15",
              textColor: "#FACC15",
              trailColor: "#374151",
              textSize: "12px",
            })}
          />
        </div>
        <div style={{ width: 70, height: 70 }}>
          <CircularProgressbar
            value={diet.totalProtein}
            maxValue={150}
            text={`${diet.totalProtein}g`}
            styles={buildStyles({
              pathColor: "#4ADE80",
              textColor: "#4ADE80",
              trailColor: "#374151",
              textSize: "12px",
            })}
          />
        </div>
        <div style={{ width: 70, height: 70 }}>
          <CircularProgressbar
            value={diet.totalCarbs}
            maxValue={250}
            text={`${diet.totalCarbs}g`}
            styles={buildStyles({
              pathColor: "#60A5FA",
              textColor: "#60A5FA",
              trailColor: "#374151",
              textSize: "12px",
            })}
          />
        </div>
        <div style={{ width: 70, height: 70 }}>
          <CircularProgressbar
            value={diet.totalFats}
            maxValue={100}
            text={`${diet.totalFats}g`}
            styles={buildStyles({
              pathColor: "#F472B6",
              textColor: "#F472B6",
              trailColor: "#374151",
              textSize: "12px",
            })}
          />
        </div>
      </div>

      {/* Meals */}
      <div className="flex flex-col gap-4">
        {diet.meals?.map((meal) => (
          <div
            key={meal._id}
            className={`rounded-xl border border-gray-600 overflow-hidden`}
          >
            {/* Meal Header */}
            <div
              className={`flex justify-between items-center cursor-pointer px-4 py-3 bg-gradient-to-r ${mealColors[meal.name] || "from-gray-700 to-gray-800"} text-white font-semibold`}
              onClick={() => toggleMeal(meal.name)}
            >
              <span>{meal.name} ({meal.calories} kcal)</span>
              {openMeals[meal.name] ? <ChevronUp /> : <ChevronDown />}
            </div>

            {/* Meal Items */}
            <AnimatePresence>
              {openMeals[meal.name] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-700 px-4 py-3 flex flex-col gap-2"
                >
                  {meal.items?.map((item) => (
                    <Tippy
                      key={item._id}
                      content={
                        <div className="text-sm text-white space-y-1">
                          <p>Protein: {item.protein}g</p>
                          <p>Carbs: {item.carbs}g</p>
                          <p>Fats: {item.fats}g</p>
                        </div>
                      }
                    >
                      <div className="flex justify-between items-center p-2 bg-gray-600 rounded hover:bg-gray-500 transition cursor-pointer">
                        <span>{item.name}</span>
                        <span className="font-semibold">{item.calories} kcal</span>
                      </div>
                    </Tippy>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
