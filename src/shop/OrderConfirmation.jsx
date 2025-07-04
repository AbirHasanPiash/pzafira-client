import { useCart } from "./CartContext";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

const OrderConfirmation = () => {
  const { items: cartItems } = useCart();
  const [showModal, setShowModal] = useState(false);

  const location = useLocation();
  const selectedAddress = location.state?.selectedAddress;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.variant?.price || 0) * item.quantity,
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
        address: selectedAddress.address,
        city: selectedAddress.city,
        country: selectedAddress.country,
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
    <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Order Confirmation</h1>

      {/* Address */}
      {selectedAddress && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-2">Delivery Address</h2>
          <p className="text-gray-700 text-sm sm:text-base">
            <strong>{selectedAddress.address}</strong><br />
            {selectedAddress.city}, {selectedAddress.postal_code}, {selectedAddress.country}
          </p>
          {selectedAddress.is_default && (
            <span className="text-green-600 text-sm font-medium mt-2 block">Default Address</span>
          )}
        </div>
      )}

      {/* Items */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">Review Your Items</h2>
        <div className="flex flex-col gap-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row justify-between border-b pb-4">
              <div className="w-full sm:w-2/3">
                <h3 className="text-lg font-medium">{item.variant?.product}</h3>
                <p className="text-gray-500 text-sm">
                  Color: <span className="font-medium">{item.variant?.color}</span> | Size:{" "}
                  <span className="font-medium">{item.variant?.size}</span>
                </p>
                <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right w-full sm:w-1/3 mt-2 sm:mt-0">
                <p className="text-lg font-semibold">
                  ৳{(Number(item.variant?.price || 0) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 border-t pt-6 text-sm sm:text-base text-gray-700 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>৳{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (10%)</span>
            <span>৳{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charge</span>
            <span>৳{deliveryCharge.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-black text-lg">
            <span>Total Amount</span>
            <span>৳{totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-black text-lg">
            <span>Rounded Total</span>
            <span>৳{Math.round(totalAmount)}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm mt-3">
          The total includes applicable VAT and a flat delivery charge of ৳100.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          <Link
            to="/cart"
            className="bg-gray-200 hover:bg-gray-300 transition px-6 py-2 rounded-md text-center text-gray-800 text-sm sm:text-base"
          >
            Back to Cart
          </Link>
          <button
            onClick={handlePlaceOrder}
            className="bg-black hover:bg-gray-800 text-white transition px-6 py-2 rounded-md text-sm sm:text-base"
          >
            Place Order
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
            <h2 className="text-2xl font-bold">Order Placed Successfully!</h2>
            <p className="text-gray-700 text-sm mt-2">
              Your order has been confirmed. Please proceed to payment to complete your purchase.
            </p>
            <div className="text-left text-sm mt-4 space-y-1">
              <p><strong>Order Status:</strong> <span className="bg-green-100 text-green-700 rounded px-2 py-0.5">Confirmed</span></p>
              <p><strong>Payment Status:</strong> <span className="bg-red-100 text-red-700 rounded px-2 py-0.5">Unpaid</span></p>
            </div>
            <div className="mt-6 space-y-2">
              <button
                onClick={handleProceedToPayment}
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
              >
                Proceed to Payment
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
