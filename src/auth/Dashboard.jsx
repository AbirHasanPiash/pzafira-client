import { useState } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import useAuth from "../auth/useAuth";
import { useCart } from "../shop/CartContext";
import { useOrders } from "../shop/OrdersContext";
import { useWishlist } from "../shop/WishlistContext";

import {
  ShoppingCartIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const { user } = useAuth();
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { items: orderItems } = useOrders();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ Use SWR to keep things reactive and efficient
  const { data: cartCount } = useSWR(
    "cart",
    () => cartItems.reduce((t, i) => t + i.quantity, 0),
    { refreshInterval: 3000 }
  );

  const { data: wishlistCount } = useSWR(
    "wishlist",
    () => wishlistItems.length,
    { refreshInterval: 5000 }
  );

  const { data: orderCount } = useSWR(
    "orders",
    () => orderItems.length,
    { refreshInterval: 5000 }
  );

  const navigation = [
    { name: "Cart", icon: ShoppingCartIcon, to: "/cart" },
    { name: "Wishlist", icon: HeartIcon, to: "/wishlist" },
    { name: "Orders", icon: ClipboardDocumentListIcon, to: "/orders" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Wrapper aligned with navbar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 py-10 flex flex-col lg:flex-row gap-8">
        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden bg-black/30 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div
              className="w-64 bg-white h-full shadow-xl p-6 absolute right-0 top-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mt-20 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <XMarkIcon
                  className="w-6 h-6 text-gray-600 cursor-pointer"
                  onClick={() => setIsSidebarOpen(false)}
                />
              </div>
              <nav className="space-y-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 text-gray-700 transition"
                  >
                    <item.icon className="w-5 h-5 text-gray-500" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white shadow-md rounded-xl p-6 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <UserCircleIcon className="w-8 h-8 text-indigo-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {user?.first_name ?? "User"}
              </h2>
              <p className="text-sm text-gray-500">My Account</p>
            </div>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="flex items-center gap-3 p-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Mobile Top Bar */}
          <div className="flex justify-between items-center lg:hidden mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <Bars3Icon
              className="w-7 h-7 text-gray-700 cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
            />
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow p-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, <span className="text-indigo-600">{user?.first_name}</span> 👋
            </h1>
            <p className="text-gray-500 mt-1">
              Here’s your personalized dashboard overview.
            </p>

            {/* Dashboard Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl shadow-sm flex items-center gap-4">
                <div className="bg-indigo-600 text-white p-3 rounded-full">
                  <ShoppingCartIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Cart Items
                  </p>
                  <p className="text-3xl font-bold text-indigo-700">
                    {cartCount ?? 0}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl shadow-sm flex items-center gap-4">
                <div className="bg-pink-600 text-white p-3 rounded-full">
                  <HeartIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Wishlist</p>
                  <p className="text-3xl font-bold text-pink-700">
                    {wishlistCount ?? 0}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm flex items-center gap-4">
                <div className="bg-green-600 text-white p-3 rounded-full">
                  <ClipboardDocumentListIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Orders</p>
                  <p className="text-3xl font-bold text-green-700">
                    {orderCount ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;