// DietCard.jsx
import React from "react";
import { Trash2 } from "lucide-react";

export default function DietCard({ diet, handleDeleteDiet }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{diet.title || "Daily Diet"}</h2>
        <button
          onClick={() => handleDeleteDiet(diet._id)} // ✅ Pass function properly
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Total Nutrition */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <span className="font-semibold">{diet.totalCalories || 0}</span>
          <p className="text-sm text-gray-400">Calories</p>
        </div>
        <div>
          <span className="font-semibold">{diet.totalProtein || 0}g</span>
          <p className="text-sm text-gray-400">Protein</p>
        </div>
        <div>
          <span className="font-semibold">{diet.totalCarbs || 0}g</span>
          <p className="text-sm text-gray-400">Carbs</p>
        </div>
      </div>

      {/* Meals */}
      <div className="flex flex-col gap-2">
        {diet.meals?.map((meal) => (
          <div key={meal._id} className="bg-gray-700 rounded p-2">
            <h3 className="font-semibold">{meal.name}</h3>
            <ul className="text-sm text-gray-300 list-disc list-inside">
              {meal.items?.map((item) => (
                <li key={item._id}>
                  {item.name} - {item.calories} kcal
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
