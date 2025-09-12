import React from "react";
import { Flame, FileText, Download } from "lucide-react"; // example icons
import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, gradient }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`relative p-5 ${gradient} rounded-xl shadow-lg flex flex-col gap-4 transition-transform cursor-pointer`}
    >
      {/* Top Row: Icon and Title */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-full">
              <Icon size={28} />
            </div>
          )}
          <p className="text-sm text-gray-100 font-semibold">{title}</p>
        </div>

        {/* Optional small buttons */}
        <div className="flex gap-2">
          <button className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded flex items-center gap-1 text-xs text-gray-100">
            <Download size={14} /> Export
          </button>
          <button className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded flex items-center gap-1 text-xs text-gray-100">
            <FileText size={14} /> Report
          </button>
        </div>
      </div>

      {/* Value */}
      <h2 className="text-2xl font-bold text-gray-100">{value}</h2>
    </motion.div>
  );
}

