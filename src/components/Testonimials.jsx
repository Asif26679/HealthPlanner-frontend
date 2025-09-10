// UltraModernTestimonials.jsx
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "John Doe",
    role: "CEO, CompanyX",
    avatar: "https://i.pravatar.cc/100?img=1",
    quote: "This product transformed the way we work. Highly recommended!",
  },
  {
    name: "Jane Smith",
    role: "CTO, TechCorp",
    avatar: "https://i.pravatar.cc/100?img=2",
    quote: "Amazing experience! The team is super responsive and helpful.",
  },
  {
    name: "Michael Lee",
    role: "Product Manager, Innovate Ltd",
    avatar: "https://i.pravatar.cc/100?img=3",
    quote: "Our workflow improved dramatically after using this solution.",
  },
  {
    name: "Emily Rose",
    role: "Designer, Creatives Co.",
    avatar: "https://i.pravatar.cc/100?img=4",
    quote: "Stunning design and intuitive interface. Love it!",
  },
];

export default function UltraModernTestimonials() {
  const [current, setCurrent] = useState(0);
  const length = testimonials.length;
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto slide
  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, []);

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 6000);
  };

  const pauseAutoSlide = () => clearInterval(intervalRef.current);

  const prevSlide = () => setCurrent((current - 1 + length) % length);
  const nextSlide = () => setCurrent((current + 1) % length);

  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchMove = (e) => (touchEndX.current = e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) nextSlide();
    if (touchStartX.current - touchEndX.current < -50) prevSlide();
  };

  return (
    <>
    
    <section
      className="relative py-32 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={pauseAutoSlide}
      onMouseLeave={startAutoSlide}
    >
    <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-green-400/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="max-w-6xl mx-auto px-6 relative">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-16">
          What Our <span className="text-green-600">Client</span> Say
        </h2>

        <div className="relative flex justify-center items-center h-96 md:h-112">
          {testimonials.map((testimonial, index) => {
            let classes =
              "absolute w-72 md:w-96 transition-all duration-700 ease-in-out";

            if (index === current)
              classes +=
                " opacity-100 scale-110 z-30 translate-x-0 rotate-0 shadow-2xl";
            else if (index === (current - 1 + length) % length)
              classes +=
                " opacity-60 scale-90 -translate-x-28 -rotate-6 z-20 shadow-lg";
            else if (index === (current + 1) % length)
              classes +=
                " opacity-60 scale-90 translate-x-28 rotate-6 z-20 shadow-lg";
            else classes += " opacity-0 scale-75 z-0";

            return (
              <div key={index} className={classes}>
                <div className="relative bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-3xl p-10 md:p-12 text-center flex flex-col items-center hover:scale-105 transition-transform duration-500">
                  <Quote className="absolute top-4 left-4 w-10 h-10 text-indigo-500 opacity-20 animate-pulse" />
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-24 h-24 rounded-full border-2 border-indigo-400 mb-4 shadow-lg"
                  />
                  <p className="text-gray-200 italic text-lg md:text-xl mb-4">
                    "{testimonial.quote}"
                  </p>
                  <h3 className="text-xl font-semibold text-white">
                    {testimonial.name}
                  </h3>
                  <span className="text-sm text-gray-400">{testimonial.role}</span>
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 p-3 rounded-full shadow-lg transition z-40"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-0 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 p-3 rounded-full shadow-lg transition z-40"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Decorative floating shapes */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-indigo-500 rounded-full opacity-20 animate-pulse blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-green-400 rounded-full opacity-20 animate-pulse blur-3xl"></div>
      </div>
    </section>
    </>
  );
}
