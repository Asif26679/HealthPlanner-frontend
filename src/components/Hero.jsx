import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/heroImage.png";
import { ChevronDown } from "lucide-react";
import Features from "./Feature";
import Pricing from "./Pricing";
import Workouts from "./Workout";
import Testimonials from "./Testonimials";
import Stats from "./Stats";


// Word-by-word animation for heading
const wordVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.3, duration: 0.6 },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: "easeOut" },
  }),
};

export default function Hero() {
  const headingWords = ["Take", "Control", "of", "Your", "Health"];

  // Scroll handler
  const handleScroll = () => {
    const nextSection = document.getElementById("features"); // 👈 target section
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
    
    <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20 gap-12 bg-gradient-to-b from-gray-900 via-black to-gray-950 overflow-hidden">
      
      {/* ANIMATED GLOW BEHIND PHONE */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0.6 }}
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[600px] h-[600px] bg-green-500/20 rounded-full blur-3xl top-1/2 left-1/4 -translate-y-1/2 -z-10"
      ></motion.div>
      
      {/* FLOATING PHONE IMAGE */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: [0, -20, 0], opacity: 1 }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className=" mt-20 relative w-[280px] md:w-[520px] drop-shadow-[0_0_40px_rgba(0,255,150,0.4)]"
      >
        <img
          src={heroImage}
          alt="Health App Mockup"
          className="w-full h-auto object-contain"
        />
      </motion.div>

      {/* TEXT CONTENT */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-xl text-center md:text-left space-y-6"
      >
        {/* Animated Heading */}
        <h1 className="text-4xl md:text-6xl font-montserrat font-extrabold leading-tight text-white flex flex-wrap gap-2 justify-center md:justify-start">
          {headingWords.map((word, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={wordVariant}
              initial="hidden"
              animate="visible"
              className={word === "Health" ? "text-green-400" : ""}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={headingWords.length * 0.3 + 0.5}
          className="text-lg md:text-xl text-gray-300"
        >
          Plan workouts, track calories, and stay motivated with ease.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={headingWords.length * 0.3 + 1}
          className="flex gap-4 justify-center md:justify-start"
        >
          <Link to={'/login'}>
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white shadow-lg rounded-xl"
          >
            Get Started
          </Button>
          
          </Link>
          
          <Button
            size="lg"
            variant="outline"
            className="border-gray-300 text-black"
          >
            Learn More
          </Button>
        </motion.div>
      </motion.div>

      {/* SCROLL DOWN INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: headingWords.length * 0.3 + 1.5, duration: 1.5, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={handleScroll}
      >
        <ChevronDown className="w-8 h-8 text-green-400" />
      </motion.div>
    </section>
      <Features></Features>
      <Stats></Stats>
      <Pricing></Pricing>
      <Workouts></Workouts>
      <Testimonials></Testimonials>
      </>
  );
}
