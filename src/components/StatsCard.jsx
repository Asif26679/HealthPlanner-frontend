import { motion } from "framer-motion";

export default function StatCard({ title, value, icon: Icon, onClick, gradient }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 250 }}
      onClick={onClick}
      className={`flex items-center justify-between rounded-lg p-4 shadow-md cursor-pointer 
        bg-gradient-to-br ${gradient} text-white hover:shadow-lg hover:shadow-black/30`}
    >
      <div>
        <p className="text-xs text-gray-200 uppercase tracking-wide">{title}</p>
        {value && <p className="text-xl font-bold mt-1">{value}</p>}
      </div>
      <div className="p-2 bg-black/30 rounded-md">
        <Icon size={22} />
      </div>
    </motion.div>
  );
}

