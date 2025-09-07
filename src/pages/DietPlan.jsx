// src/pages/DietPlan.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DietPlan() {
  const { id } = useParams();
  const [diet, setDiet] = useState(null);

  useEffect(() => {
    const fetchDiet = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setDiet(data);
      } catch (error) {
        console.error("Error fetching diet:", error);
      }
    };
    fetchDiet();
  }, [id]);

  if (!diet) return <p className="text-gray-400">Loading diet plan...</p>;

  return (
    <div className="p-6 min-h-screen bg-neutral-950 text-white">
      <h1 className="text-3xl font-bold mb-6">{diet.title}</h1>
      <p className="text-gray-400 mb-6">Total Calories: {diet.totalCalories}</p>

      <div className="space-y-4">
        {diet.meals.map((meal, idx) => (
          <div
            key={idx}
            className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800"
          >
            <h2 className="text-lg font-semibold text-green-400">{meal.name}</h2>
            <p className="text-gray-300">Calories: {meal.calories}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
