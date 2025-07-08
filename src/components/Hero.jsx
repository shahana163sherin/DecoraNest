import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Slide data
const slides = [
  {
    id: 1,
    title: "Welcome to DecoraNest",
    description: "Find your perfect touch of elegance & comfort",
    image: null, // First slide has no image
  },
  {
    id: 2,
    title: "Discover Cozy Wall Decor",
    description: "Give your space a warm, personal touch",
    image: "/assets/purple.jpeg", // Add your image here
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  // Change slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="h-[60vh] flex items-center justify-center bg-gradient-to-r from-pink-100 to-purple-200 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center px-4 max-w-xl"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {slides[current].title}
          </h1>
          <p className="text-lg text-gray-600 mb-6">{slides[current].description}</p>

          {slides[current].image ? (
            <div className="flex justify-center mt-6">
              <div className="bg-purple-100 rounded-full p-4">
                <img
                  src={slides[current].image}
                  alt="Decor"
                  className="w-24 h-24 object-cover rounded-full"
                />
              </div>
            </div>
          ) : (
            <button className="bg-purple-700 text-white px-6 py-2 rounded-full hover:bg-purple-800 transition">
              Shop Now
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default Hero;
