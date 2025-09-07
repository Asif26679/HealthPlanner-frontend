// Plans.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const plans = [
  {
    id: 1,
    name: "Basic",
    monthlyPrice: 499,
    features: [
      { name: "Access to all workouts", info: "All beginner and intermediate workouts included." },
      { name: "Basic support", info: "Get support via email within 48 hours." },
      { name: "Community access", info: "Join our community forum to discuss with others." },
    ],
    popular: false,
  },
  {
    id: 2,
    name: "Pro",
    monthlyPrice: 999,
    features: [
      { name: "All Basic features", info: "Includes everything in Basic plan." },
      { name: "Personalized diet plan", info: "Custom diet plan based on your goals." },
      { name: "Priority support", info: "Get priority response from our support team." },
    ],
    popular: true,
  },
  {
    id: 3,
    name: "Premium",
    monthlyPrice: 1499,
    features: [
      { name: "All Pro features", info: "Includes everything in Pro plan." },
      { name: "1-on-1 coaching", info: "One-on-one sessions with a certified coach." },
      { name: "Advanced analytics", info: "Track your progress in detail." },
      { name: "Exclusive content", info: "Access premium workouts and diet plans." },
    ],
    popular: false,
  },
];

export default function Plans() {
  const [isYearly, setIsYearly] = useState(false);

  const toggleBilling = () => setIsYearly(!isYearly);

  const getPrice = (plan) => {
    if (isYearly) {
      const yearlyPrice = plan.monthlyPrice * 12 * 0.8; // 20% discount
      return Math.round(yearlyPrice);
    }
    return plan.monthlyPrice;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-5 sm:px-10 lg:px-20">
      <motion.h1
        className="text-4xl sm:text-5xl font-bold mb-8 text-center text-green-400"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Pricing Plans
      </motion.h1>

      {/* Billing Toggle */}
      <div className="flex justify-center items-center mb-12">
        <span className={`mr-3 font-semibold ${!isYearly ? "text-green-400" : "text-gray-300"}`}>
          Monthly
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isYearly}
            onChange={toggleBilling}
          />
          <div className="w-12 h-6 bg-gray-700 rounded-full peer peer-checked:bg-green-500 transition-all"></div>
          <div
            className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"
          ></div>
        </label>
        <span className={`ml-3 font-semibold ${isYearly ? "text-green-400" : "text-gray-300"}`}>
          Yearly (20% off)
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            className={`relative bg-gray-800 rounded-xl p-6 flex flex-col items-center shadow-lg border-2 ${
              plan.popular ? "border-green-500" : "border-gray-700"
            }`}
            whileHover={{
              scale: 1.05,
              boxShadow: plan.popular
                ? "0 0 35px rgba(16,185,129,0.8)"
                : "0 0 20px rgba(16,185,129,0.6)",
            }}
          >
            {plan.popular && (
              <motion.span
                className="absolute top-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                Most Popular
              </motion.span>
            )}
            <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
            <p className="text-4xl font-extrabold mb-2">
              ₹{getPrice(plan)}
              <span className="text-lg font-medium text-gray-300">
                /{isYearly ? "year" : "month"}
              </span>
            </p>
            <ul className="mb-6 space-y-2 text-left w-full text-gray-300">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 relative group">
                  <span className="text-green-400 font-bold">✔</span>
                  {feature.name}
                  {/* Tooltip */}
                  <span className="absolute left-full ml-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1 w-48 z-10">
                    {feature.info}
                  </span>
                </li>
              ))}
            </ul>
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold w-full transition-transform active:scale-95">
              Buy Now
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
