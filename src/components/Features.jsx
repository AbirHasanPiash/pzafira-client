import features from "../data/featuresData";
import { useMemo } from "react";

const bgGradients = [
    "from-pink-200 via-cyan-200 to-red-200",
    "from-yellow-200 via-blue-200 to-rose-200",
    "from-lime-200 via-blue-200 to-teal-200",
    "from-cyan-200 via-red-200 to-indigo-200",
    "from-purple-200 via-pink-200 to-pink-200",
    "from-emerald-200 via-green-200 to-lime-200",
    "from-sky-200 via-green-200 to-teal-200",
    "from-amber-200 via-red-200 to-rose-200",
    "from-indigo-200 via-blue-400 to-purple-200",
    "from-rose-200 via-pink-200 to-purple-200",
  ];

const FeatureCard = ({ title, subtitle, icon: Icon }) => {
  const randomGradient = useMemo(() => {
    const idx = Math.floor(Math.random() * bgGradients.length);
    return bgGradients[idx];
  }, []);

  return (
    <div className={`rounded-2xl shadow-lg p-6 bg-gradient-to-br ${randomGradient} animate-gradient transition-all duration-300`}>
      <div className="mb-4">
        <Icon className="text-4xl text-white animate-spin-interval" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-700">{subtitle}</p>
    </div>
  );
};

const Features = () => {
  return (
    <section className="bg-white py-12 container px-6 sm:px-10 md:px-16 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10">Why Choose Us</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default Features;