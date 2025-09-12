import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function StatCard({ title, value, icon: Icon, onClick, gradient, progress, animateValue }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!animateValue) return;
    let start = 0;
    const end = value || 0;
    const duration = 1500; // animation duration in ms
    const increment = end / (duration / 30); // 30ms interval

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(counter);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 30);

    return () => clearInterval(counter);
  }, [value, animateValue]);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 250 }}
      onClick={onClick}
      className={`relative flex flex-col justify-between rounded-xl p-5 shadow-md cursor-pointer
        bg-gradient-to-br ${gradient} text-white overflow-hidden`}
    >
      {/* Top: Title and value */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm text-gray-200 uppercase">{title}</p>
          {value !== undefined && (
            <p className="text-2xl font-bold mt-1">
              {animateValue ? displayValue : value} {title === "Calories" ? "kcal" : ""}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-black/30 rounded-lg">
            <Icon size={26} />
          </div>
        )}
      </div>

      {/* Bottom: Progress bar */}
      {progress !== undefined && (
        <div className="absolute bottom-0 left-0 w-full h-2 bg-black/20 rounded-full mt-3 overflow-hidden">
          <motion.div
            className={`h-2 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      )}
    </motion.div>
  );
}

