import React from "react";

export default function StatsCard({ title, value, icon: Icon, gradient }) {
  return (
    <div className={`p-5 ${gradient} rounded-xl shadow-lg flex items-center gap-4`}>
      {Icon && <Icon size={28} />}
      <div>
        <p className="text-sm text-gray-900">{title}</p>
        <h2 className="text-xl font-bold">{value}</h2>
      </div>
    </div>
  );
}
