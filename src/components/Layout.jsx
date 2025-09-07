// Layout.jsx
import React from "react";
import { Home, Activity, Apple, Settings, Bell, User } from "lucide-react";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 bg-gray-800/70 backdrop-blur-md p-4 flex flex-col">
        {/* <div className="text-2xl font-bold mb-8 hidden md:block text-indigo-400">
          FitTrack
        </div> */}
        <nav className="flex flex-col space-y-4 mt-20">
          <button className="flex items-center space-x-2 hover:text-indigo-400 transition">
            <Home className="w-5 h-5" /> <span className="hidden md:inline">Dashboard</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-indigo-400 transition">
            <Activity className="w-5 h-5" /> <span className="hidden md:inline">Workouts</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-indigo-400 transition">
            <Apple className="w-5 h-5" /> <span className="hidden md:inline">Diet</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-indigo-400 transition">
            <Settings className="w-5 h-5" /> <span className="hidden md:inline">Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 mt-20">{children}</main>
    </div>
  );
}
