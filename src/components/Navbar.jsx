import { useState, useRef, useEffect } from "react";
import { Menu, X, ShoppingCart, Heart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { preload } from "swr";
import AccountModal from "./AccountModal";
import BrandLogo from "./BrandLogo";
import fetcher from "../api/fetcher";
import { useCart } from "../shop/CartContext";
import { useWishlist } from "../shop/WishlistContext";

/**
 * `target_customer` is the parameter Shop reads from the URL. The mobile menu
 * previously sent `target_audience`, so the audience links silently fell back
 * to the unfiltered catalogue on small screens.
 */
const SHOP_LINKS = [
  { label: "Shop", to: "/shop", endpoint: "/products/api/detail-products/" },
  {
    label: "Men",
    to: "/shop?target_customer=men",
    endpoint: "/products/api/detail-products/?target_audience=men",
  },
  {
    label: "Women",
    to: "/shop?target_customer=women",
    endpoint: "/products/api/detail-products/?target_audience=women",
  },
  {
    label: "Kids",
    to: "/shop?target_customer=kids",
    endpoint: "/products/api/detail-products/?target_audience=kids",
  },
];

/**
 * Warms both halves of the next navigation while the pointer is still moving:
 * the route's JS chunk and the data that route will ask for.
 */
const prefetchShop = (endpoint) => {
  import("../shop/Shop");
  preload(endpoint, fetcher);
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const accountButtonRef = useRef(null);
  const modalRef = useRef(null);

  const { items } = useCart();
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const { items: wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        accountButtonRef.current &&
        !accountButtonRef.current.contains(e.target)
      ) {
        setShowAccountModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md w-full z-50 sticky top-0 transition: all 0.3s ease;">
      <div className="container px-6 sm:px-10 md:px-16 max-w-7xl mx-auto py-4 flex items-center justify-between">
        <div>
          <BrandLogo />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 font-medium">
          {SHOP_LINKS.map(({ label, to, endpoint }) => (
            <Link
              key={to}
              to={to}
              onMouseEnter={() => prefetchShop(endpoint)}
              onFocus={() => prefetchShop(endpoint)}
              className="transition-transform duration-300 ease-in-out hover:scale-105"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <Link to="/wishlist">
              <div className="transition-transform duration-300 ease-in-out hover:scale-110">
                <Heart size={22} />
              </div>
            </Link>
            {wishlistCount > 0 && (
              <span className="absolute -top-2.5 -right-2 bg-red-600 text-white text-xs font-bold p-0.5 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </div>

          <div className="relative">
            <Link to="/cart">
              <div className="transition-transform duration-300 ease-in-out hover:scale-110">
                <ShoppingCart size={22} />
              </div>
            </Link>
            {cartItemCount > 0 && (
              <span className="absolute -top-2.5 -right-2 bg-red-600 text-white text-xs font-bold p-0.5 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </div>

          <button
            onClick={() => setShowAccountModal((prev) => !prev)}
            className="transition-transform duration-300 ease-in-out hover:scale-110"
            ref={accountButtonRef}
          >
            <User size={22} />
          </button>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Account dropdown modal */}
          {showAccountModal && (
            <div ref={modalRef} className="absolute top-0 right-0">
              <AccountModal closeModal={() => setShowAccountModal(false)} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-2 font-medium">
          {SHOP_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="block transition-transform duration-300 ease-in-out hover:scale-105"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
