import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MealAccordion({ meal, expanded, toggleExpand, color }) {
  return (
    <div className={`mb-4 rounded-lg overflow-hidden bg-gradient-to-r ${color} shadow-md`}>
      <button
        onClick={toggleExpand}
        className="w-full flex justify-between items-center px-4 py-2 font-medium text-gray-900"
      >
        <span>{meal?.name}</span>
        <span>{meal?.calories || 0} kcal</span>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden px-4 py-2 space-y-2 text-gray-900"
          >
            {(meal.foods || []).map((food, idx) => (
              <div
                key={idx}
                className="flex justify-between bg-gray-100/20 px-3 py-2 rounded-lg"
              >
                <span>{food?.name}</span>
                <span>{food?.calories || 0} kcal</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
