import { useState } from "react";
import { Link } from "react-router-dom";
import "./BrandLogo.css"; // custom CSS for animation

const hoverColors = [
  "text-white",
  "text-yellow-300",
  "text-lime-400",
  "text-rose-300",
  "text-emerald-300",
  "text-orange-400",
  "text-cyan-300",
  "text-indigo-300",
];

const BrandLogo = () => {
  const [hoverColor, setHoverColor] = useState("");

  const handleMouseEnter = () => {
    const random = hoverColors[Math.floor(Math.random() * hoverColors.length)];
    setHoverColor(random);
  };

  const handleMouseLeave = () => {
    setHoverColor("");
  };

  return (
    <Link to="/" className="group text-2xl sm:text-3xl font-bold inline-block">
      <span
        className={`brand-gradient-text transition-colors duration-500 ${hoverColor}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Pzafira
      </span>
    </Link>
  );
};

export default BrandLogo;