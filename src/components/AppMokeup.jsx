// AppMockup.jsx
import React from "react";
import heroImage from "../assets/heroImage.png"; // Replace with your app screenshot

export default function AppMockup() {
  return (
    <section className="bg-gray-900 py-32 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-600 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-pink-500 rounded-full opacity-30 blur-3xl"></div>

      <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-16 z-10 relative">
        Experience Our App
      </h2>

      {/* Phone Mockup */}
      <div className="relative z-10 w-64 md:w-96 h-[600px] md:h-[700px] flex items-center justify-center">
        <div className="bg-gray-800 rounded-3xl shadow-2xl w-full h-full relative overflow-hidden">
          {/* Top notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-2 bg-gray-700 rounded-full mt-2"></div>

          {/* Screen content */}
          <img
            src={heroImage}
            alt="App Screenshot"
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>

        {/* Floating shadows for 3D effect */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-64 md:w-96 h-12 bg-indigo-600 opacity-20 rounded-full blur-3xl"></div>
      </div>

      <p className="text-gray-300 text-center mt-12 max-w-2xl text-lg md:text-xl z-10 relative">
        Our app brings all the features right to your fingertips. Smooth, fast, and intuitive experience on both iOS and Android.
      </p>
    </section>
  );
}
