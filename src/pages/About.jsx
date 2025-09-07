// About.jsx
import React from "react";
import { Lightbulb, Users, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-16 flex flex-col items-center">
      {/* Hero Section */}
      <div className="max-w-3xl text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          About{" "}
          <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            Us
          </span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
        Welcome to HealthPlanner, your trusted companion for a healthier and happier lifestyle. We believe that health is not just about physical fitness, but also about balanced nutrition, proper hydration, and overall well-being. Our mission is to provide simple, effective, and personalized guidance that helps you stay consistent on your health journey.
        </p>
      </div>

      {/* Mission & Vision Section */}
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 mb-20">
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-md hover:shadow-lg hover:scale-105 transition-transform">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">
            Our Mission
          </h2>
          <p className="text-gray-300 leading-relaxed">
          We aim to inspire individuals to build lifelong healthy habits by combining technology with practical solutions. Whether it’s tracking workouts, planning meals, or staying motivated, our goal is to support you in achieving your personal health and wellness goals with confidence.
          </p>
        </div>
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-md hover:shadow-lg hover:scale-105 transition-transform">
          <h2 className="text-2xl font-semibold mb-3 text-emerald-400">
            Our Vision
          </h2>
          <p className="text-gray-300 leading-relaxed">
            To become a leading platform that transforms the way individuals and
            businesses achieve their goals through technology and innovation.
          </p>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="max-w-5xl w-full text-center mb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Our <span className="text-green-400">Values</span>
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-gray-800/60 rounded-2xl p-8 flex flex-col items-center shadow-md hover:shadow-xl hover:-translate-y-2 transition">
            <Lightbulb className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-lg font-semibold">Innovation</h3>
            <p className="text-gray-400 text-sm mt-2">
              We constantly explore new ideas to create impactful solutions.
            </p>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-8 flex flex-col items-center shadow-md hover:shadow-xl hover:-translate-y-2 transition">
            <Shield className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-lg font-semibold">Integrity</h3>
            <p className="text-gray-400 text-sm mt-2">
              We uphold honesty and transparency in everything we do.
            </p>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-8 flex flex-col items-center shadow-md hover:shadow-xl hover:-translate-y-2 transition">
            <Users className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold">Teamwork</h3>
            <p className="text-gray-400 text-sm mt-2">
              We believe collaboration drives success and lasting impact.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-6xl w-full text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Meet the <span className="text-green-400">Team</span>
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {[
            { name: "John Doe", role: "CEO" },
            { name: "Jane Smith", role: "CTO" },
            { name: "Michael Lee", role: "Product Manager" },
          ].map((member, i) => (
            <div
              key={i}
              className="bg-gray-800/60 rounded-xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-2"
            >
              <div className="w-24 h-24 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                {member.name[0]}
              </div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-gray-400 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
