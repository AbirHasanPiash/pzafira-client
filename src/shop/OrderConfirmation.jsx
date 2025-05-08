import { useCart } from "./CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

const OrderConfirmation = () => {
  const { items: cartItems } = useCart();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.variant?.price || 0) * item.quantity),
    0
  );
  const taxRate = 0.1;
  const deliveryCharge = 100;
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount + deliveryCharge;

  const handlePlaceOrder = () => {
    setShowModal(true);
  };

  const handleProceedToPayment = async () => {
    setShowModal(false);
  
    try {
      const cartId = localStorage.getItem("cartId");
      const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
      const response = await api.post("/payment/api/initiate/", {
        amount: totalAmount.toFixed(2),
        cartId,
        totalItems,
      });
  
      if (response.data?.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        console.error("Payment URL not received");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Something went wrong while initiating payment.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center">
        Order Confirmation
      </h1>

      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center sm:text-left">
          Review Your Items
        </h2>

        <div className="flex flex-col gap-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row justify-between items-center border-b pb-4"
            >
              <div className="text-center md:text-left w-full md:w-2/3">
                <h3 className="text-base sm:text-lg font-medium">{item.variant?.product}</h3>
                <p className="text-sm sm:text-base text-gray-500 mt-1">
                  Color: <span className="font-medium">{item.variant?.color}</span> | Size:{" "}
                  <span className="font-medium">{item.variant?.size}</span>
                </p>
                <p className="text-sm sm:text-base text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <div className="text-center md:text-right mt-4 md:mt-0 w-full md:w-1/3">
                <p className="text-base sm:text-lg font-semibold">
                  Subtotal: <span className="text-xl">৳</span>{(Number(item.variant?.price || 0) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="mt-10 border-t pt-6 space-y-3 text-sm sm:text-base text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span><span className="text-xl">৳</span>{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (10%)</span>
            <span><span className="text-xl">৳</span>{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charge</span>
            <span><span className="text-xl">৳</span>{deliveryCharge.toFixed(2)}</span>
          </div>
          <hr className="my-2 border-gray-300" />
          <div className="flex justify-between text-lg sm:text-xl font-bold text-black">
            <span>Total Amount</span>
            <span><span className="text-xl">৳</span>{totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg sm:text-xl font-bold text-black">
            <span>Rounded Total Amount</span>
            <span><span className="text-xl">৳</span>{Math.round(totalAmount.toFixed(2))}</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          The total includes applicable VAT and a flat delivery charge of <span className="text-xl">৳</span>100.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            to="/cart"
            className="text-center bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition text-sm sm:text-base w-full sm:w-auto"
          >
            Back to Cart
          </Link>
          <button
            onClick={handlePlaceOrder}
            className="text-center bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition text-sm sm:text-base w-full sm:w-auto"
          >
            Place Order
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 bg-opacity-50 flex items-center justify-center px-4 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 sm:p-8 text-center space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold">Order Placed Successfully!</h2>
            <p className="text-gray-700 text-sm sm:text-base">
              Your order has been confirmed. Please proceed to payment to complete your purchase.
            </p>
            <div className="text-left text-sm sm:text-base mt-4 space-y-2">
              <p><strong>Order Status:</strong> <span className="bg-green-100 rounded p-1 text-green-700">Confirmed</span></p>
              <p><strong>Payment Status:</strong> <span className="bg-red-100 rounded p-1 text-red-700">Unpaid</span></p>
            </div>
            <button
              onClick={handleProceedToPayment}
              className="mt-6 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            >
              Proceed to Payment
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
