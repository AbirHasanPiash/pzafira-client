import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import carouselData from "../data/carouselData";

const variants = {
  enter: (direction) => ({
    x: direction === "left" ? 1000 : -1000,
    opacity: 0,
    position: "absolute",
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "relative",
    transition: {
      duration: 0.7,
      ease: "easeInOut",
    },
  },
  exit: (direction) => ({
    x: direction === "left" ? -1000 : 1000,
    opacity: 0,
    position: "absolute",
  }),
};

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("left");

  const totalSlides = carouselData.length;

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const goToPrev = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToNext = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? "left" : "right");
    setCurrentIndex(index);
  };

  const { heading, subheading, image } = carouselData[currentIndex];

  return (
    <section className="relative bg-white py-10 my-20 overflow-hidden">
      <div className="container px-6 sm:px-10 md:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row-reverse items-center gap-12">
          {/* Text */}
          <motion.div
            key={currentIndex + "-text"}
            className="flex-1 flex flex-col justify-center text-center lg:text-left space-y-4"
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
          >
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 leading-tight">
              {heading}
            </h1>
            <p className="text-lg md:text-xl text-gray-600">{subheading}</p>
          </motion.div>

          {/* Image */}
          <div className="flex-1 relative w-full h-72 md:h-[400px] overflow-hidden rounded-3xl shadow-xl">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={currentIndex + "-image"}
                src={image}
                alt={heading}
                className="absolute inset-0 w-full h-full object-cover rounded-3xl"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
              />
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:scale-105 transition"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:scale-105 transition"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {carouselData.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index ? "bg-gray-800 scale-110" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Carousel;
