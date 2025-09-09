// HomeFeatures.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, CheckCircle, Download, Smile } from "lucide-react";

// ✅ Animated counter component
function Counter({ to, duration }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / (duration * 60));
    const timer = setInterval(() => {
      start += step;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [to, duration]);

  return <span>{count}</span>;
}

export default function Stats() {
  const features = [
    {
      icon: <Users className="w-10 h-10 text-indigo-400" />,
      value: <Counter to={5000} duration={2} />,
      suffix: "+",
      label: "Active Users",
    },
    {
      icon: <CheckCircle className="w-10 h-10 text-green-400" />,
      value: <Counter to={120} duration={2} />,
      suffix: "+",
      label: "Projects Completed",
    },
    {
      icon: <Download className="w-10 h-10 text-yellow-400" />,
      value: <Counter to={10000} duration={2} />,
      suffix: "+",
      label: "App Downloads",
    },
    {
      icon: <Smile className="w-10 h-10 text-pink-400" />,
      value: <Counter to={98} duration={2} />,
      suffix: "%",
      label: "Client Satisfaction",
    },
  ];

  return (
    <section className="bg-gray-950 text-white py-24 relative">
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-green-400/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Trusted by Thousands of{" "}
          <span className="text-green-600 bg-clip-text">
            Users Worldwide
          </span>
        </motion.h2>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="rounded-2xl p-8 text-center bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-indigo-400 transition-all shadow-md hover:shadow-lg hover:shadow-indigo-500/20"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-4xl font-extrabold text-white">
                {item.value}
                {item.suffix}
              </h3>
              <p className="text-gray-400 mt-2 text-lg">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
