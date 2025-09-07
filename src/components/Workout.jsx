// src/components/Workouts.jsx
import React from "react";
import { motion } from "framer-motion";
import { Dumbbell, HeartPulse, StretchHorizontal, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const workouts = [
  {
    icon: <Dumbbell className="w-10 h-10 text-green-500" />,
    title: "Strength Training",
    desc: "Build muscle and increase endurance with guided strength plans.",
  },
  {
    icon: <HeartPulse className="w-10 h-10 text-red-500" />,
    title: "Cardio Blast",
    desc: "High-energy workouts to improve stamina and burn calories fast.",
  },
  {
    icon: <StretchHorizontal className="w-10 h-10 text-purple-500" />,
    title: "Yoga & Flexibility",
    desc: "Relax your mind and body with calming yoga routines.",
  },
  {
    icon: <Bike className="w-10 h-10 text-blue-500" />,
    title: "Cycling",
    desc: "Boost cardiovascular health with beginner to advanced cycling plans.",
  },
];

export default function Workouts() {
  return (
    <section
      id="workouts"
      className="relative py-20 px-6 md:px-20 bg-gradient-to-b from-gray-900 via-black to-gray-950"
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold text-white"
        >
          Guided <span className="text-green-500">Workouts</span>
        </motion.h2>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          Choose from multiple workout styles to match your fitness journey.
        </p>

        {/* Workout Cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {workouts.map((workout, index) => (
            <motion.div
              key={index}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="p-6 bg-gray-800 rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-green-100/10 rounded-full mx-auto mb-6">
                {workout.icon}
              </div>
              <h3 className="text-xl font-semibold text-white">
                {workout.title}
              </h3>
              <p className="mt-3 text-gray-400">{workout.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12"
        >
          <Button
            asChild
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full shadow-lg"
          >
            <Link to="/workouts">See All Workouts</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

