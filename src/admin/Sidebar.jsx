import { NavLink } from "react-router-dom";
import {
  BarChart,
  Users,
  Star,
  X,
  Tag,
  Palette,
  Layers,
  Ruler,
  Boxes,
} from "lucide-react";
import { FaBoxOpen } from "react-icons/fa";

const linkClasses = ({ isActive }) =>
  `block px-2 py-1 rounded flex items-center gap-2 transition-colors duration-200 ${
    isActive
      ? "bg-black/90 text-white font-semibold"
      : "text-gray-700 hover:text-blue-600"
  }`;

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 transition-opacity duration-300 md:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 mt-15 sm:mt-0 border border-black rounded left-0 w-45 md:w-50 bg-white shadow-md p-6 z-40 transform transition-transform duration-300
          ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:relative md:flex`}
      >
        {/* Close icon for mobile */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-4">
          <NavLink to="/admin" className={linkClasses}>
            <BarChart size={20} /> Dashboard
          </NavLink>
          <NavLink to="/admin/top-users" className={linkClasses}>
            <Users size={20} /> Top Users
          </NavLink>
          <NavLink to="/admin/top-products" className={linkClasses}>
            <Star size={20} /> Top Products
          </NavLink>
          <NavLink to="/admin/products" className={linkClasses}>
            <Boxes size={20} /> Products
          </NavLink>
          <NavLink to="/admin/brands" className={linkClasses}>
            <Tag size={20} /> Brands
          </NavLink>
          <NavLink to="/admin/categories" className={linkClasses}>
            <Layers size={20} /> Categories
          </NavLink>
          <NavLink to="/admin/colors" className={linkClasses}>
            <Palette size={20} /> Colors
          </NavLink>
          <NavLink to="/admin/sizes" className={linkClasses}>
            <Ruler size={20} /> Sizes
          </NavLink>
          <NavLink to="/admin/order-history" className={linkClasses}>
            <FaBoxOpen size={20} /> Orders
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
