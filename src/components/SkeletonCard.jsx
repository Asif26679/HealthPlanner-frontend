// SkeletonCard.jsx
import React from "react";

export default function SkeletonCard() {
  return (
    <div className="bg-red-600 rounded-xl shadow-md p-4 animate-pulse h-40 w-full">
      <div className="h-6 w-24 bg-green-400 rounded mb-4"></div>
      <div className="h-4 w-16 bg-green-600 rounded mb-2"></div>
      <div className="h-4 w-32 bg-green-600 rounded"></div>
    </div>
  );
}
