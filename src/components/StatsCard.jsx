import React from "react";

export default function StatsCard({ title, value, icon: Icon, gradient, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-5 ${gradient} rounded-xl shadow-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:scale-105 transform transition-all duration-300`}
    >
      {Icon && <Icon size={28} />}
      <p className="text-sm text-white">{title}</p>
      {value && <h2 className="text-xl font-bold">{value}</h2>}
    </div>
  );
}


