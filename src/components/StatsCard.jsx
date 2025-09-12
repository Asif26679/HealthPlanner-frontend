import { motion, useAnimation, AnimatePresence } from "framer-motion";

export default function StatCard({ title, value, icon: Icon, onClick, gradient, isCalories }) {
  const controls = useAnimation();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 250 }}
      onClick={onClick}
      className={`relative flex flex-col justify-between rounded-xl p-5 shadow-lg cursor-pointer
        bg-gradient-to-br ${gradient} text-white overflow-hidden`}
    >
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm text-gray-200 uppercase">{title}</p>
          {value && (
            <motion.p
              className={`text-2xl font-bold mt-1 ${isCalories ? "text-yellow-200" : ""}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {value}
            </motion.p>
          )}
        </div>
        <div className="p-3 bg-black/30 rounded-lg">
          <Icon size={26} />
        </div>
      </div>

      {/* Animated bar for calories */}
      {isCalories && (
        <div className="absolute bottom-0 left-0 w-full h-2 bg-black/20 rounded-full mt-3 overflow-hidden">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
            initial={{ width: 0 }}
            animate={{ width: "100%" }} // Can later be dynamic: calories / dailyGoal
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      )}
    </motion.div>
  );
}
