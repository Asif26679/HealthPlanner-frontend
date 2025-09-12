import { Flame, Download } from "lucide-react";
import { motion } from "framer-motion";

function StatCard({ title, value, icon: Icon, onClick, gradient }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl p-5 shadow-md cursor-pointer 
        bg-gradient-to-br ${gradient} text-white hover:shadow-lg hover:shadow-black/30`}
    >
      <div>
        <p className="text-sm text-gray-200">{title}</p>
        {value && <p className="text-2xl font-semibold">{value}</p>}
      </div>
      <div className="p-3 bg-black/30 rounded-lg">
        <Icon size={26} />
      </div>
    </motion.div>
  );
}

{/* Stats Section */}
{loadingDiet ? (
  <div className="grid md:grid-cols-3 gap-6 mb-8">
    {Array(3).fill().map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
) : (
  diets.length > 0 && (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Total Calories"
        value={`${diets[0]?.totalCalories || 0} kcal`}
        icon={Flame}
        gradient="from-orange-500 to-yellow-500"
      />

      <StatCard
        title="Export Report"
        value="PDF"
        icon={Download}
        gradient="from-gray-700 to-gray-900"
        onClick={() => exportDietPDF(diets[0], user)}
      />
    </div>
  )
)}




