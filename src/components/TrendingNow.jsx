import { motion } from "framer-motion";
import trendingData from "../data/trendingData";

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      delay: i * 0.3,
    },
  }),
};

const TrendingNow = () => {
  return (
    <section style={{
    background: "linear-gradient(to bottom, white, #fecdd3, #bfdbfe, #fbcfe8, white)",
  }} className="py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-24"
        >
         Trending Now
        </motion.h2>

        {/* Timeline-style layout */}
        <div className="flex flex-col gap-28">
          {trendingData.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
              className={`flex flex-col lg:flex-row items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              } gap-10 lg:gap-24`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2 overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full object-cover rounded-3xl transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Text */}
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  Explore this hot trend that’s catching attention across all styles.
                  Add a bit of flair to your wardrobe today with our latest picks.
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingNow;
