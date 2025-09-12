import { Flame, Utensils, Activity, Droplets } from "lucide-react";
import StatsCard from "./StatsCard";

export default function StatsSection({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Calories"
        value={`${stats.calories || 0} kcal`}
        icon={Flame}
        gradient="bg-gradient-to-r from-yellow-400 to-yellow-600"
      />
      <StatsCard
        title="Meals"
        value={stats.meals || 0}
        icon={Utensils}
        gradient="bg-gradient-to-r from-green-400 to-green-600"
      />
      <StatsCard
        title="Activity"
        value={stats.activity || "Sedentary"}
        icon={Activity}
        gradient="bg-gradient-to-r from-blue-400 to-blue-600"
      />
      <StatsCard
        title="Water Intake"
        value={`${stats.water || 0} L`}
        icon={Droplets}
        gradient="bg-gradient-to-r from-teal-400 to-teal-600"
      />
    </div>
  );
}
