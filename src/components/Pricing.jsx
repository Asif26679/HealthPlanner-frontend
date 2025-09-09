// src/components/Pricing.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    title: "Basic",
    monthly: "Free",
    yearly: "Free",
    desc: "Perfect for beginners who want to start tracking fitness.",
    features: [
      "Workout logging",
      "Basic calorie tracker",
      "Daily activity summary",
    ],
  },
  {
    title: "Pro",
    monthly: "₹499",
    yearly: "₹1499",
    desc: "For fitness enthusiasts who want more insights & features.",
    features: [
      "Personalized workout plans",
      "Advanced calorie tracking",
      "Progress insights & charts",
      "Sync across devices",
    ],
    highlighted: true,
  },
  {
    title: "Premium",
    monthly: "$19/mo",
    yearly: "$190/yr",
    desc: "For serious athletes with custom coaching & nutrition.",
    features: [
      "1-on-1 coaching",
      "Custom nutrition plans",
      "Priority support",
      "All Pro features included",
    ],
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState("monthly");

  return (
    <section
      id="pricing"
      className="relative py-20 px-6 md:px-20 bg-gradient-to-b from-gray-950 via-black to-gray-900"
    >
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-green-400/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-white"
        >
          Simple <span className="text-green-500">Pricing</span>
        </motion.h2>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          Choose a plan that fits your fitness journey. Upgrade anytime.
        </p>

        {/* Toggle Switch */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <span
            className={`cursor-pointer ${
              billing === "monthly" ? "text-green-500 font-semibold" : "text-gray-400"
            }`}
            onClick={() => setBilling("monthly")}
          >
            Monthly
          </span>
          <div
            className="w-12 h-6 bg-gray-700 rounded-full relative cursor-pointer"
            onClick={() =>
              setBilling(billing === "monthly" ? "yearly" : "monthly")
            }
          >
            <motion.div
              layout
              className="absolute top-1 left-1 w-4 h-4 bg-green-500 rounded-full"
              animate={{ x: billing === "yearly" ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </div>
          <span
            className={`cursor-pointer ${
              billing === "yearly" ? "text-green-500 font-semibold" : "text-gray-400"
            }`}
            onClick={() => setBilling("yearly")}
          >
            Yearly <span className="text-xs text-green-400">(Save 20%)</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative flex flex-col p-8 rounded-2xl shadow-lg border transition-transform duration-300 hover:-translate-y-2 ${
                plan.highlighted
                  ? "bg-gradient-to-b from-green-600 to-green-500 text-white border-green-400 scale-105"
                  : "bg-gray-800 text-white border-gray-700"
              }`}
            >
              {/* Badge for Highlighted */}
              {plan.highlighted && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-green-600 px-3 py-1 text-sm font-semibold rounded-full shadow-md">
                  Popular
                </span>
              )}

              {/* Title & Price */}
              <h3 className="text-2xl font-bold">{plan.title}</h3>
              <p className="mt-2 text-4xl font-extrabold">
                {billing === "monthly" ? plan.monthly : plan.yearly}
              </p>
              <p className="mt-2 text-gray-300 text-sm">{plan.desc}</p>

              {/* Features */}
              <ul className="mt-6 space-y-3 text-left">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                className={`mt-8 w-full ${
                  plan.highlighted
                    ? "bg-white text-green-600 hover:bg-gray-100"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

