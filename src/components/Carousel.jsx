import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import carouselData from "../data/carouselData";

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("left"); // default slide: left
  const totalSlides = carouselData.length;

  // Auto Slide (left direction by default)
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
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
  const slideClass = direction === "left" ? "slide-left" : "slide-right";

  return (
    <div className="w-full bg-white overflow-hidden relative">
      <div className="px-6 md:px-16 mt-4 mb-8">
        <div
          className={`flex flex-col-reverse lg:flex-row-reverse items-center justify-between gap-8 ${slideClass}`}
        >
          {/* Text */}
          <div className="flex-1 text-center lg:text-left space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
              {heading}
            </h1>
            <p className="text-gray-600 text-lg md:text-xl">{subheading}</p>
          </div>

          {/* Image */}
          <div className="flex-1 w-full">
            <img
              src={image}
              alt={heading}
              className="w-full h-72 md:h-[400px] object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={goToNext}
        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 hover:opacity-50"
      >
        <ChevronLeft size={40} />
      </button>
      <button
        onClick={goToPrev}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 hover:opacity-50"
      >
        <ChevronRight size={40} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {carouselData.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full ${
              currentIndex === index ? "bg-black scale-105" : "bg-gray-300"
            } transition-all duration-300`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;