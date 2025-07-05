import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

const STATUS_CHOICES = [
  ["pending", "Pending"],
  ["processing", "Processing"],
  ["shipped", "Shipped"],
  ["delivered", "Delivered"],
  ["cancelled", "Cancelled"],
];

const PAYMENT_STATUS_CHOICES = [
  ["unpaid", "Unpaid"],
  ["pending", "Pending"],
  ["paid", "Paid"],
  ["failed", "Failed"],
  ["refunded", "Refunded"],
];

const OrderCard = ({ order, isStaff, refresh }) => {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
  const [loading, setLoading] = useState(false);

  const toggleExpand = () => setExpanded((prev) => !prev);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await api.patch(`/orders/api/orders/${order.id}/`, {
        status,
        payment_status: paymentStatus,
      });
      refresh();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const orderTotal = Number(order.total_price);
  const tax = orderTotal * 0.1;
  const delivery = 100;
  const grandTotal = Math.round(orderTotal + tax + delivery);

  // Soft colors for each status
  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    processing: "bg-blue-100 text-blue-800 border-blue-300",
    shipped: "bg-indigo-100 text-indigo-800 border-indigo-300",
    delivered: "bg-green-100 text-green-800 border-green-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
  };

  const paymentColor = {
    unpaid: "bg-gray-100 text-gray-800 border-gray-300",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    paid: "bg-green-100 text-green-800 border-green-300",
    failed: "bg-red-100 text-red-800 border-red-300",
    refunded: "bg-blue-100 text-blue-800 border-blue-300",
  };

  return (
    <div className="rounded-2xl shadow-md bg-white p-6 transition hover:shadow-xl">
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Order Meta */}
        <div className="space-y-1">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">Order ID:</span> #
            {order.id}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">Placed on:</span>{" "}
            {new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          {isStaff && (
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Last update:</span>{" "}
              {new Date(order.updated_at).toLocaleDateString("en-US")}
            </p>
          )}
        </div>

        {/* Shipping */}
        {order.shipping_address && (
          <div className="text-sm text-gray-600 w-full lg:max-w-md">
            <p className="font-semibold text-gray-700 mb-1">Shipping Address</p>
            <p className="text-gray-700">{order.shipping_address}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap lg:justify-end items-start gap-4 w-full">
          {/* Staff actions or badges */}
          <div className="flex flex-wrap items-center gap-2">
            {isStaff ? (
              <>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="text-sm px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-black"
                >
                  {PAYMENT_STATUS_CHOICES.map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="text-sm px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-black"
                >
                  {STATUS_CHOICES.map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-semibold text-white bg-black hover:bg-black/80 rounded-md transition"
                >
                  {loading ? "Saving..." : "Update"}
                </button>
              </>
            ) : (
              <>
                <span
                  className={clsx(
                    "text-xs font-semibold px-3 py-1.5 rounded-full border",
                    paymentColor[order.payment_status]
                  )}
                >
                  {order.payment_status_display}
                </span>

                <span
                  className={clsx(
                    "text-xs font-semibold px-3 py-1.5 rounded-full border",
                    statusColor[order.status]
                  )}
                >
                  {order.status_display}
                </span>
              </>
            )}
          </div>

          {/* Totals */}
          <div className="text-sm text-gray-600 space-y-0.5 text-right min-w-[180px]">
            <p>
              Subtotal:{" "}
              <span className="font-medium">৳ {orderTotal.toFixed(2)}</span>
            </p>
            <p>
              Tax (10%): <span className="font-medium">৳ {tax.toFixed(2)}</span>
            </p>
            <p>
              Delivery:{" "}
              <span className="font-medium">৳ {delivery.toFixed(2)}</span>
            </p>
            <p className="font-bold text-gray-800 text-base pt-1 border-t mt-1">
              Grand Total: <span className="text-xl">৳</span>{" "}
              {grandTotal.toFixed(2)}
            </p>
          </div>

          {/* Toggle Button */}
          <button
            onClick={toggleExpand}
            className="text-sm flex items-center gap-1 text-white bg-black hover:bg-black/80 px-3 py-2 rounded-full transition ml-auto"
          >
            {expanded ? (
              <>
                <FaChevronUp /> Hide Items
              </>
            ) : (
              <>
                <FaChevronDown /> View Items
              </>
            )}
          </button>
        </div>
      </div>

      {/* Items with Framer Motion */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden mt-6 border-t pt-4"
          >
            <div className="space-y-4">
              {order.items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.variant.product}{" "}
                      <span className="text-xs text-gray-500">
                        ({item.variant.color}, {item.variant.size})
                      </span>
                    </p>
                    <p className="text-gray-600">
                      <span className="text-xl">৳</span> {item.price} ×{" "}
                      {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 text-right mt-2 sm:mt-0">
                    <span className="text-xl">৳</span>{" "}
                    {(item.price * item.quantity).toFixed(2)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderCard;
