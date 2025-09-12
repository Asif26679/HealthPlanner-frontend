import { motion, AnimatePresence } from "framer-motion";

export default function StatCard({ title, value, icon: Icon, onClick, gradient, isCalories }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 250 }}
      onClick={onClick}
      className={`relative flex flex-col justify-between rounded-lg p-4 shadow-md cursor-pointer
        bg-gradient-to-br ${gradient} text-white hover:shadow-lg hover:shadow-black/30 overflow-hidden`}
    >
      <div className="flex items-center justify-between z-10 relative">
        <div>
          <p className="text-xs text-gray-200 uppercase tracking-wide">{title}</p>
          {value && (
            <motion.p
              className={`text-xl font-bold mt-1 ${isCalories ? "text-yellow-300" : ""}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {value}
            </motion.p>
          )}
        </div>
        <div className="p-2 bg-black/30 rounded-md">
          <Icon size={22} />
        </div>
      </div>

      {/* Animated Calories bar */}
      {isCalories && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/30 rounded-full mt-2">
          <motion.div
            className="h-1 rounded-full bg-yellow-400"
            initial={{ width: 0 }}
            animate={{ width: "100%" }} // You can make this dynamic based on calories goal
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </div>
      )}
    </motion.div>
  );
}
