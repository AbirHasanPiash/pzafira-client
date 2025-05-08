import { useEffect, useState } from "react";


const tailwindColorMap = {
    red: "from-red-200",
    blue: "via-blue-200",
    green: "to-green-200",
    purple: "from-purple-200",
    pink: "via-pink-200",
    yellow: "to-yellow-200",
    indigo: "via-indigo-200",
    teal: "via-teal-200",
    orange: "via-orange-200",
    lime: "via-lime-200",
    cyan: "via-cyan-200",
    rose: "via-rose-200",
    emerald: "via-emerald-200",
    sky: "via-sky-200",
    violet: "via-violet-200",
  };

const keys = Object.keys(tailwindColorMap);

const getRandomGradientClasses = () => {
  const shuffled = [...keys].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);
  return selected.map((key) => tailwindColorMap[key]);
};

const AnimatedButton = ({ text, Icon }) => {
  const [gradientClasses, setGradientClasses] = useState([]);
  const [spinTrigger, setSpinTrigger] = useState(false);

  useEffect(() => {
    setGradientClasses(getRandomGradientClasses());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpinTrigger(true);
      setTimeout(() => setSpinTrigger(false), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
        className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3
            text-sm sm:text-base md:text-lg
            rounded-xl flex items-center justify-center gap-1 sm:gap-2 md:gap-3 font-bold
            bg-gradient-to-r ${gradientClasses.join(" ")} animate-gradient
            transition-all duration-300 ease-in-out
            shadow-[6px_6px_12px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.6)]
            hover:shadow-[2px_2px_6px_rgba(0,0,0,0.15),-2px_-2px_4px_rgba(255,255,255,0.5)]
            active:scale-95`}
        >
      {Icon && (
        <Icon
            className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform 
            ${spinTrigger ? "animate-spin-horizontal" : ""}`}
        />
        )}
      <span>{text}</span>
    </button>
  );
};

export default AnimatedButton;
