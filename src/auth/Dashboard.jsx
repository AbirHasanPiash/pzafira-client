import useAuth from "../auth/useAuth";
import { useState } from "react";
import { useCart } from "../shop/CartContext";
import { useOrders } from "../shop/OrdersContext";

import {
  ShoppingCartIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useWishlist } from "../shop/WishlistContext";

const Dashboard = () => {
  const { user } = useAuth();
  const { items } = useCart();
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  const { items: wishlistItems } = useWishlist();
  const { items: orderItems } = useOrders();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: "Cart", icon: ShoppingCartIcon, to: "/cart" },
    { name: "Wishlist", icon: HeartIcon, to: "/wishlist" },
    { name: "Order History", icon: ClipboardDocumentListIcon, to: "/orders" },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className={`fixed inset-0 z-40 lg:hidden ${isSidebarOpen ? "animate-slide-in-right" : "animate-slide-out-right"}`}
          onClick={() => setIsSidebarOpen(false)}
        >

          <div
            className="w-64 bg-white h-full shadow-xl p-6 absolute right-0 top-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
              <XMarkIcon
                className="w-6 h-6 text-gray-600 cursor-pointer"
                onClick={() => setIsSidebarOpen(false)}
              />
            </div>
            <nav className="space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className="flex items-center gap-3 text-gray-700 hover:text-black transition"
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:w-64 bg-white p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
        <nav className="space-y-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10">
        {/* Mobile Top Bar */}
        <div className="flex justify-between items-center lg:hidden mb-6">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <Bars3Icon
            className="w-6 h-6 text-gray-700 cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-lg">
            Welcome,{" "}
            <span className="font-semibold">{user?.first_name}</span>!
          </p>
          <p className="text-gray-500 mt-1">
            Here's a quick look at your activity.
          </p>

          {/* Dashboard Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-indigo-100 p-6 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-600">Cart Items</p>
              <p className="text-2xl font-bold text-indigo-700">
                {cartItemCount}
              </p>
            </div>
            <div className="bg-pink-100 p-6 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-600">Wishlist</p>
              <p className="text-2xl font-bold text-pink-700">
                {wishlistItems.length}
              </p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-600">Orders</p>
              <p className="text-2xl font-bold text-green-700">
                {orderItems.length}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
