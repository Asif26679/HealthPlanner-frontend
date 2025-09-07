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

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 6000);
    return () => clearInterval(interval);
  }, [length]);

  const prevSlide = () => setCurrent((current - 1 + length) % length);
  const nextSlide = () => setCurrent((current + 1) % length);

  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchMove = (e) => (touchEndX.current = e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) nextSlide();
    if (touchStartX.current - touchEndX.current < -50) prevSlide();
  };

  return (
    <section
      className="bg-gray-900 py-32 flex justify-center relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-6xl w-full px-6 relative">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-50">
          What Our Clients Say
        </h2>

        <div className="relative flex justify-center items-center">
          {testimonials.map((testimonial, index) => {
            let positionClass = "opacity-0 scale-75 z-0";

            if (index === current) {
              positionClass = "opacity-100 scale-110 z-30";
            } else if (index === (current - 1 + length) % length) {
              positionClass = "opacity-60 scale-90 -translate-x-24 rotate-[-6deg] z-20";
            } else if (index === (current + 1) % length) {
              positionClass = "opacity-60 scale-90 translate-x-24 rotate-[6deg] z-20";
            }

            return (
              <div
                key={index}
                className={`transition-all duration-700 ease-in-out absolute w-80 md:w-96 ${positionClass}`}
              >
                <div className="backdrop-blur-md bg-gray-800/70 border border-gray-700 rounded-3xl shadow-2xl p-10 md:p-12 text-center flex flex-col items-center relative hover:scale-105 transition-transform">
                  {/* Floating quote */}
                  <Quote className="absolute top-4 left-4 w-10 h-10 text-indigo-500 opacity-20" />

                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-24 h-24 rounded-full border-2 border-indigo-400 mb-4"
                  />
                  <p className="text-gray-200 italic text-lg md:text-xl relative z-10">
                    "{testimonial.quote}"
                  </p>
                  <h3 className="text-xl font-semibold text-white">{testimonial.name}</h3>
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
      </div>
    </section>
  );
}

