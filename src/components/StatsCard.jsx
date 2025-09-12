import React from "react";
import { motion, animate } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, gradient, onClick }) {
  const [animatedValue, setAnimatedValue] = React.useState(0);

  React.useEffect(() => {
    if (typeof value === "string" && value.match(/\d/)) {
      const num = parseInt(value);
      const controls = animate(0, num, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (v) => setAnimatedValue(Math.floor(v)),
      });
      return () => controls.stop();
    }
  }, [value]);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      onClick={onClick}
      className="relative group p-6 rounded-2xl shadow-lg cursor-pointer overflow-hidden bg-gray-900/80 backdrop-blur-xl border border-gray-700 hover:border-green-400 transition"
    >
      {/* Glow border effect */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-20 ${gradient}`}
      />

      {/* Card content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-3">
        {Icon && (
          <div className="relative">
            {/* Icon aura glow */}
            <motion.div
              className="absolute inset-0 rounded-full blur-xl opacity-40"
              style={{ background: "radial-gradient(circle, rgba(0,255,200,0.5), transparent)" }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <div className="p-4 rounded-full bg-gray-800/90 backdrop-blur-lg">
              <Icon className="w-10 h-10 text-white" />
            </div>
          </div>
        )}

        <h2 className="text-lg font-semibold text-gray-300">{title}</h2>
        <motion.p
          key={animatedValue}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600"
        >
          {title === "Total Calories" ? `${animatedValue} kcal` : value}
        </motion.p>
      </div>
    </motion.div>
  );
}



