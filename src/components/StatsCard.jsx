// StatsCard.jsx
import React from "react";
import { motion, animate } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, gradient, onClick }) {
  const [animatedValue, setAnimatedValue] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (typeof value === "string" && value.match(/\d/)) {
      const num = parseInt(value); // extract number
      const controls = animate(0, num, {
        duration: 2,
        onUpdate: (v) => {
          setAnimatedValue(Math.floor(v));
          setProgress(v / num); // progress in %
        },
      });
      return () => controls.stop();
    }
  }, [value]);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className="relative bg-gray-800 overflow-hidden p-6 rounded-2xl shadow-lg flex flex-col items-center cursor-pointer transition"
    >
      {/* Animated background fill */}
      <motion.div
        className={`absolute inset-0 ${gradient} opacity-40`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{ originX: 0 }}
      />

      {/* Content above the animation */}
      <div className="relative z-10 flex flex-col items-center">
        {Icon && <Icon className="w-8 h-8 mb-3 text-white" />}
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-2xl font-bold mt-2">
          {title === "Total Calories" ? `${animatedValue} kcal` : value}
        </p>
      </div>
    </motion.div>
  );
}



