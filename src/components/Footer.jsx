// Footer.jsx
import React from "react";
import { Instagram, Twitter, Facebook, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-950 to-gray-900 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Logo & About */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-indigo-500 bg-clip-text text-transparent">
            HealthPlanner
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Building modern web experiences. Helping businesses and individuals grow 
            with <span className="text-green-400 font-semibold">innovation</span> 
            and <span className="text-indigo-400 font-semibold">design</span>.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-white font-semibold text-lg mb-2">Quick Links</h3>
          <a
            href="#features"
            className="hover:text-green-400 transition duration-300"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="hover:text-green-400 transition duration-300"
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            className="hover:text-green-400 transition duration-300"
          >
            Testimonials
          </a>
          <a
            href="#contact"
            className="hover:text-green-400 transition duration-300"
          >
            Contact
          </a>
        </div>

        {/* Social & Contact */}
        <div className="flex flex-col space-y-6">
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">Follow Us</h3>
            <div className="flex space-x-4">
              {[
                { Icon: Instagram, link: "#" },
                { Icon: Twitter, link: "#" },
                { Icon: Facebook, link: "#" },
                { Icon: Linkedin, link: "#" },
              ].map(({ Icon, link }, idx) => (
                <a
                  key={idx}
                  href={link}
                  className="p-2 rounded-full bg-gray-800 hover:bg-green-500 transition transform hover:scale-110"
                >
                  <Icon className="w-5 h-5 text-white" />
                </a>
              ))}
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            Contact us:{" "}
            <a
              href="mailto:info@yourbrand.com"
              className="hover:text-green-400 font-medium transition"
            >
              info@yourbrand.com
            </a>
          </p>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="text-white font-semibold">HealthPlanner</span>. All
        rights reserved.
      </div>
    </footer>
  );
}

