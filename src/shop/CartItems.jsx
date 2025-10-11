import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "./CartContext";

const CartItems = () => {
  const {
    items: cartItems,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [confirmClearing, setConfirmClearing] = useState(false);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },);

  const handleClearCart = () => {
    setShowClearCartModal(true);
  };

  const confirmClearCart = async () => {
    setConfirmClearing(true);
    await clearCart();
    setConfirmClearing(false);
    setShowClearCartModal(false);
  };

  return (
    <div className="container max-w-7xl mx-auto px-6 sm:px-10 md:px-16 py-10">
      {loading && (
        <div className="min-h-screen flex justify-center items-center">
          <div className="spinner"></div>
        </div>
      )}
      <h1 className="text-xl sm:text-2xl font-bold mb-8 text-center">
        Cart Items
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center min-h-screen text-gray-500 text-base md:text-lg">
          Your cart is empty.
          <div className="mt-4">
            <Link
              to="/shop"
              className="inline-block text-sm bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between mb-6">
            <button>
              <Link
                to="/shop"
                className="inline-block text-sm bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
              >
                Continue Shopping
              </Link>
            </button>
            <button
              onClick={handleClearCart}
              className="bg-red-600 text-sm text-white px-5 py-2 rounded-md hover:bg-red-700 transition"
            >
              Empty Cart
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center bg-white shadow-md rounded-lg p-5 gap-6 hover:shadow-lg transition"
              >
                {/* Image */}
                <div className="w-32 h-32 flex-shrink-0">
                  <img
                    src={item.image || "/images/default_img.png"}
                    alt={item.variant?.product || "Product"}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                {/* Info + Controls */}
                <div className="flex-1 flex flex-col md:flex-row justify-between items-center w-full gap-4">
                  {/* Product Info */}
                  <div className="text-center md:text-left">
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold">
                        {item.variant?.product || "Unnamed Product"}
                      </h2>
                      <Link
                        to={`/shop/${item.variant?.product_id}`}
                        className="inline-block mt-2 bg-black text-white text-sm px-4 py-1 rounded hover:bg-gray-800 transition"
                      >
                        Details
                      </Link>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                      Color:{" "}
                      <span className="font-medium">
                        {item.variant?.color || "N/A"}
                      </span>{" "}
                      | Size:{" "}
                      <span className="font-medium">
                        {item.variant?.size || "N/A"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Unit Price:{" "}
                      <span className="font-medium">
                        <span className="text-xl">৳</span>
                        {Number(item.variant?.price || 0)}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Available Stock: {item.variant?.stock ?? "N/A"}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col items-center md:items-end gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-semibold w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Subtotal:</span>
                      <span className="font-semibold text-base md:text-lg">
                        <span className="text-xl">৳</span>
                        {(
                          Number(item.variant?.price || 0) * item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center">
            <h2 className="text-xl md:text-2xl font-bold">
              Total: <span className="text-3xl">৳</span>
              {cartItems
                .reduce(
                  (total, item) =>
                    total + Number(item.variant?.price || 0) * item.quantity,
                  0
                )
                .toFixed(2)}
            </h2>
            <Link
              to="/addreses"
              className="mt-4 md:mt-0 text-sm bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}

      {showClearCartModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-lg text-center w-80"
          >
            <h2 className="text-lg font-semibold mb-4">Confirm Clear Cart</h2>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Are you sure you want to remove all items from your cart?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmClearCart}
                disabled={confirmClearing}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                {confirmClearing ? "Clearing..." : "Yes, Clear"}
              </button>
              <button
                onClick={() => setShowClearCartModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CartItems;
