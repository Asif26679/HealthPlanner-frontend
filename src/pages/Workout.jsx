// Workout.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Example workout data
const workouts = [
  {
    id: 1,
    name: "Push Ups",
    category: "Chest",
    duration: "10 mins",
    difficulty: "Easy",
    completion: 40,
    img: "https://source.unsplash.com/400x300/?pushup",
    steps: [
      { step: "Get into plank position" },
      { step: "Lower your body slowly" },
      { step: "Push back up" },
      { step: "Repeat 3 sets" },
    ],
  },
  {
    id: 2,
    name: "Squats",
    category: "Legs",
    duration: "15 mins",
    difficulty: "Medium",
    completion: 70,
    img: "https://source.unsplash.com/400x300/?squat",
    steps: [
      { step: "Stand with feet shoulder-width apart" },
      { step: "Lower your body" },
      { step: "Rise back slowly" },
      { step: "Repeat 4 sets" },
    ],
  },
];

const categories = ["All", "Chest", "Legs", "Core", "Yoga"];

export default function Workout() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const filteredWorkouts =
    selectedCategory === "All"
      ? workouts
      : workouts.filter((w) => w.category === selectedCategory);

  const getDifficultyIcons = (level) => {
    switch (level) {
      case "Easy":
        return "🔥";
      case "Medium":
        return "🔥🔥";
      case "Hard":
        return "🔥🔥🔥";
      default:
        return "";
    }
  };

  const startWorkout = (workout) => {
    setSelectedWorkout(workout);
    setCurrentStep(0);
    setIsCompleted(false);
  };

  const nextStep = () => {
    if (currentStep < selectedWorkout.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-10 px-5 md:px-10 lg:px-20">
      <motion.h1
        className="text-4xl sm:text-5xl font-bold mb-8 text-center text-green-400 mt-11"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Workout Plans
      </motion.h1>

      {/* Category Tabs */}
      <div className="flex justify-center gap-2 sm:gap-4 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 sm:px-5 py-2 rounded-full border-2 font-semibold text-sm sm:text-base transition-all duration-300 ${
              selectedCategory === cat
                ? "bg-green-500 border-green-500 text-white shadow-lg"
                : "border-gray-500 text-gray-300 hover:border-green-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Workout Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredWorkouts.map((workout) => (
          <motion.div
            key={workout.id}
            className="bg-gradient-to-tr from-gray-700 via-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg relative cursor-pointer"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16, 185, 129, 0.6)" }}
          >
            <img
              src={workout.img}
              alt={workout.name}
              className="w-full h-40 sm:h-48 object-cover"
            />
            <div className="p-4 sm:p-5">
              <motion.h2 className="text-xl sm:text-2xl font-bold mb-2">
                {workout.name}
              </motion.h2>
              <p className="mb-1 text-gray-300 text-sm sm:text-base">
                Duration: {workout.duration}
              </p>
              <p className="mb-3 text-sm sm:text-base">
                Difficulty: <span>{getDifficultyIcons(workout.difficulty)}</span>
              </p>

              <div className="bg-gray-600 rounded-full h-2 sm:h-3 mb-4 overflow-hidden">
                <motion.div
                  className="h-2 sm:h-3 rounded-full"
                  style={{ background: "linear-gradient(90deg, #22c55e, #14b8a6)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${workout.completion}%` }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                ></motion.div>
              </div>

              <motion.button
                className="bg-green-500 px-4 sm:px-5 py-2 rounded-full hover:bg-green-600 transition-transform font-semibold w-full text-sm sm:text-base active:scale-95"
                whileHover={{ scale: 1.05 }}
                onClick={() => startWorkout(workout)}
              >
                Start Workout
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Workout Modal */}
      <AnimatePresence>
        {selectedWorkout && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 rounded-xl p-6 sm:p-8 max-w-md w-full relative flex flex-col items-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-300 hover:text-white text-2xl font-bold"
                onClick={() => setSelectedWorkout(null)}
              >
                &times;
              </button>

              <div className="w-full mb-4">
                <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-3 rounded-full"
                    style={{ background: "linear-gradient(90deg, #22c55e, #14b8a6)" }}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((currentStep + 1) / selectedWorkout.steps.length) * 100}%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  ></motion.div>
                </div>
                <p className="text-sm mt-1 text-center text-gray-300">
                  Progress: {Math.round(((currentStep + 1) / selectedWorkout.steps.length) * 100)}%
                </p>
              </div>

              {isCompleted ? (
                <div className="text-center w-full">
                  <h2 className="text-3xl font-bold text-green-400 mb-4 animate-pulse">
                    Workout Completed! 🎉
                  </h2>

                  <ul className="space-y-2 text-left max-h-80 overflow-y-auto w-full mb-4">
                    {selectedWorkout.steps.map((step, idx) => (
                      <li key={idx} className="bg-gray-700 rounded px-2 py-1">
                        Step {idx + 1}: {step.step}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="bg-green-500 px-6 py-3 rounded hover:bg-green-600 font-semibold active:scale-95"
                    onClick={() => setSelectedWorkout(null)}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-green-400 text-center animate-pulse">
                    {selectedWorkout.name}
                  </h2>
                  <p className="mb-4 text-sm sm:text-base text-center">
                    Step {currentStep + 1}: {selectedWorkout.steps[currentStep].step}
                  </p>

                  <div className="flex justify-between mt-4 w-full gap-2">
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="bg-gray-700 px-3 py-2 rounded flex-1 text-sm sm:text-base disabled:opacity-50 hover:scale-105 transition-transform"
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextStep}
                      className="bg-green-500 px-3 py-2 rounded flex-1 text-sm sm:text-base hover:scale-105 transition-transform"
                    >
                      {currentStep === selectedWorkout.steps.length - 1 ? "Finish" : "Next"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

