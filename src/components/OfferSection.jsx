import { useState, useEffect } from "react";
import AnimatedButton from "./AnimatedButton";
import { Link } from "react-router-dom";

const OfferSection = ({ endDate }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(endDate) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <section className="bg-white py-12 px-6 md:px-16 mb-12">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-10">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
            Big Seasonal Sale!
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Up to <span className="text-4xl text-red-600 font-semibold">50%</span> off on selected collections. Limited time only!
          </p>

        {/* Countdown */}
        <div className="flex justify-center lg:justify-start gap-6 mt-6">
        {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center">
            <div
                className="text-3xl md:text-5xl font-bold text-gray-800 transition-transform duration-300 ease-in-out transform animate-pop"
                key={`${unit}-${value}`}
            >
                {String(value).padStart(2, "0")}
            </div>
            <div className="uppercase text-xs mt-2 text-gray-500 tracking-widest">
                {unit}
            </div>
            </div>
        ))}
        </div>

          {/* Button */}
          <div className="mt-8 flex justify-center lg:justify-start">
            <Link to="/shop">
              <AnimatedButton text="Shop Now" className="font-bold">
              </AnimatedButton>
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src="images/family_fashion.png"
            alt="Sale Offer"
            className="w-full max-w-md rounded-2xl shadow-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
