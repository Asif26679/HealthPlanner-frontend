// src/components/Features.jsx
import React from "react";
import { motion } from "framer-motion";
import { Dumbbell, Flame, Activity, Apple } from "lucide-react";

const features = [
  {
    icon: <Dumbbell className="w-8 h-8 text-green-500" />,
    title: "Workout Planner",
    desc: "Plan your workouts with ease and stay consistent every day.",
  },
  {
    icon: <Flame className="w-8 h-8 text-green-500" />,
    title: "Calorie Tracker",
    desc: "Track your calorie intake and stay aligned with your diet goals.",
  },
  {
    icon: <Activity className="w-8 h-8 text-green-500" />,
    title: "Progress Tracking",
    desc: "Monitor your fitness journey with simple, clean analytics.",
  },
  {
    icon: <Apple className="w-8 h-8 text-green-500" />,
    title: "Healthy Habits",
    desc: "Build lasting healthy habits that keep you motivated long-term.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative py-20 px-6 md:px-12 bg-gradient-to-b from-gray-900 via-black to-gray-950 overflow-hidden"
    >
      {/* Glowing background circles */}
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-green-400/10 rounded-full blur-2xl animate-pulse"></div>

      <div className="relative max-w-6xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-white"
        >
          Stay <span className="text-green-500">Healthy</span>, Stay{" "}
          <span className="text-green-500">Strong</span>
        </motion.h2>

        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          Focus on what matters: your health. These features are designed to keep things simple and effective.
        </p>

        {/* Feature Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              animate={{
                y: [0, -6, 0], // floating up and down
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: index * 0.3,
              }}
              className="p-6 border border-gray-700 bg-gray-800/60 backdrop-blur rounded-xl shadow-md 
                         hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] hover:border-green-500/50 
                         transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-green-100/10 rounded-lg mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

