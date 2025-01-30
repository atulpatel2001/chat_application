"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { Dialog } from "@headlessui/react";

// Sidebar Sections
const slides = [
  { id: 1, title: "Profile", content: "This is your profile section." },
  { id: 2, title: "Notifications", content: "Manage your notifications here." },
  { id: 3, title: "Settings", content: "Customize your settings here." },
];

const RightSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="fixed top-0 right-0 h-screen">
      {/* Sidebar Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 z-50"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Sidebar Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black opacity-30 z-40" onClick={toggleSidebar} />}

      {/* Sidebar Content */}
      <Dialog open={isOpen} onClose={toggleSidebar} className="relative z-50">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-6 flex flex-col justify-between z-50"
        >
          {/* Close Button (INSIDE Sidebar) */}
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-gray-600 hover:text-black"
          >
            <X size={24} />
          </button>

          {/* Slide Content */}
          <div className="flex flex-col flex-grow mt-8">
            <h2 className="text-lg font-semibold mb-2">{slides[currentSlide].title}</h2>
            <p className="text-gray-600">{slides[currentSlide].content}</p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={prevSlide}
              className="p-2 bg-gray-300 hover:bg-gray-400 rounded-lg disabled:opacity-50"
              disabled={currentSlide === 0}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 bg-gray-300 hover:bg-gray-400 rounded-lg disabled:opacity-50"
              disabled={currentSlide === slides.length - 1}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </Dialog>
    </div>
  );
};

export default RightSidebar;
