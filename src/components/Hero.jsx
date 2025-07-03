import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden h-full">
      {/* Background image for desktop */}
      <div className="absolute inset-0 block z-0">
        <img
          src="images/hero-bg.png"
          alt="Desktop Background"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Optional overlay */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      {/* Content */}
      <div className="relative z-10 container max-w-7xl mx-auto px-6 md:px-16 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left space-y-6 text-white"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Unleash Your Style<br /> With Confidence
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            Discover fashion that speaks for you — elegant, bold, and always original.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
            <Link
              to="/shop"
              className="bg-white text-black px-6 py-3 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition hover:bg-gray-100"
            >
              Shop Now
            </Link>
            <Link
              to="/about"
              className="border border-white text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-white hover:text-black transition"
            >
              Learn More
            </Link>
          </div>
        </motion.div>

        {/* Empty column or use it for balance on desktop */}
        <div className="hidden lg:block" />
      </div>
    </section>
  );
};

export default Hero;
