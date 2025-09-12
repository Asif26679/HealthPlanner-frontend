// StatsCard.jsx
import React from "react";
import { motion, animate } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, gradient, onClick }) {
  const [animatedValue, setAnimatedValue] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (typeof value === "string" && value.match(/\d/)) {
      const num = parseInt(value);
      const controls = animate(0, num, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (v) => {
          setAnimatedValue(Math.floor(v));
          setProgress(v / num);
        },
      });
      return () => controls.stop();
    }
  }, [value]);

  return (
    <motion.div
      whileHover={{ scale: 1.07, boxShadow: "0px 0px 20px rgba(0,255,150,0.4)" }}
      onClick={onClick}
      className="relative backdrop-blur-xl bg-gray-900/60 border border-white/10 p-6 rounded-2xl shadow-lg flex flex-col items-center cursor-pointer transition-all overflow-hidden"
    >
      {/* Animated gradient fill */}
      <motion.div
        className={`absolute inset-0 ${gradient}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{ originX: 0 }}
      />

      {/* Subtle overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Card content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {Icon && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-3 rounded-full bg-white/10 backdrop-blur-lg mb-3"
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
        )}
        <h2 className="text-lg font-semibold text-gray-200">{title}</h2>
        <motion.p
          key={animatedValue}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-extrabold mt-2 text-white"
        >
          {title === "Total Calories" ? `${animatedValue} kcal` : value}
        </motion.p>
      </div>
    </motion.div>
  );
}



