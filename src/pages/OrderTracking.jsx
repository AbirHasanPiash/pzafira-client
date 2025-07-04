import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTrack = (e) => {
    e.preventDefault();
    setError("");
    setTrackingInfo(null);

    // Simulate tracking logic — Replace with actual API request
    if (orderId === "123456" && email === "user@example.com") {
      setTrackingInfo({
        status: "Shipped",
        estimatedDelivery: "July 8, 2025",
        currentLocation: "Dhaka Hub",
        items: [
          { name: "Slim Fit Jeans", qty: 1 },
          { name: "Casual Cotton T-Shirt", qty: 2 },
        ],
      });
    } else {
      setError("No order found with the provided information.");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen py-14 px-6 sm:px-10 md:px-16 bg-white text-gray-800"
    >
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Heading */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold">Track Your Order</h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
            Enter your order ID and email to view the latest status of your delivery.
          </p>
        </div>

        {/* Tracking Form */}
        <form
          onSubmit={handleTrack}
          className="bg-white p-6 rounded-md shadow-sm space-y-5"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium">Order ID</label>
            <input
              type="text"
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. 123456"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-black text-white flex items-center justify-center gap-2 px-6 py-2 rounded-md font-medium"
          >
            <Search size={18} />
            Track Order
          </motion.button>

          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </form>

        {/* Tracking Results */}
        {trackingInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-blue-50 border border-blue-200 p-6 rounded-md space-y-4"
          >
            <h2 className="text-lg font-semibold text-blue-700">
              Order Status: {trackingInfo.status}
            </h2>
            <p className="text-sm text-gray-700">
              <strong>Estimated Delivery:</strong> {trackingInfo.estimatedDelivery}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Current Location:</strong> {trackingInfo.currentLocation}
            </p>
            <div className="pt-2">
              <strong className="block mb-1 text-gray-700">Items:</strong>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {trackingInfo.items.map((item, i) => (
                  <li key={i}>
                    {item.name} &times; {item.qty}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default OrderTracking;
