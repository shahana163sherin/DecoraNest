// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";


// const slides = [
//   {
//     id: 1,
//     title: "Welcome to DecoraNest",
//     description: "Find your perfect touch of elegance & comfort",
//     image: null, 
//   },
//   {
//     id: 2,
//     title: "Discover Cozy Wall Decor",
//     description: "Give your space a warm, personal touch",
//     image: "/assets/purple.jpeg", 
//   },
// ];

// const Hero = () => {
//   const [current, setCurrent] = useState(0);

  
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % slides.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="h-[60vh] flex items-center justify-center bg-gradient-to-r from-pink-100 to-purple-200 overflow-hidden">
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={slides[current].id}
//           initial={{ x: 300, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           exit={{ x: -300, opacity: 0 }}
//           transition={{ duration: 0.7 }}
//           className="text-center px-4 max-w-xl"
//         >
//           <h1 className="text-4xl font-bold text-gray-800 mb-4">
//             {slides[current].title}
//           </h1>
//           <p className="text-lg text-gray-600 mb-6">{slides[current].description}</p>

//           {slides[current].image ? (
//             <div className="flex justify-center mt-6">
//               <div className="bg-purple-100 rounded-full p-4">
//                 <img
//                   src={slides[current].image}
//                   alt="Decor"
//                   className="w-24 h-24 object-cover rounded-full"
//                 />
//               </div>
//             </div>
//           ) : (
//             <button className="bg-purple-700 text-white px-6 py-2 rounded-full hover:bg-purple-800 transition">
//               Shop Now
//             </button>
//           )}
//         </motion.div>
//       </AnimatePresence>
//     </section>
//   );
// };

// export default Hero;

import React from "react";

const Hero = () => {
  return (
    <section className="relative h-[60vh] overflow-hidden">
      {/* 📽️ Background Video */}
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/assets/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>


      
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to DecoraNest</h1>
        <p className="text-lg mb-6">Find your perfect touch of elegance & comfort</p>
       
      </div>
    </section>
  );
};

export default Hero;

