import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import clsx from "clsx";
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
  console.log(order);
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

  return (
    <div className="rounded-2xl shadow-md bg-white p-6 transition hover:shadow-lg">
      {/* Top section: Order Info & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Order Info */}
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

        {order.shipping_address && (
          <div className="text-sm text-gray-600 w-full">
            <p className="font-semibold text-gray-700 mb-1">Shipping Address</p>
            <p className="text-gray-600">{order.shipping_address}</p>
          </div>
        )}

        {/* Right section: Controls, Totals, Toggle */}
        <div className="flex flex-wrap lg:justify-end items-start gap-4 w-full">
          {/* Staff Controls or Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {isStaff ? (
              <>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="text-sm px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                  className="text-sm px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                  className="px-4 py-2 text-sm font-semibold text-white bg-gray-950 hover:bg-gray-800 rounded-md transition"
                >
                  {loading ? "Saving..." : "Update"}
                </button>
              </>
            ) : (
              <>
                <span
                  className={clsx(
                    "text-xs font-semibold px-3 py-1.5 rounded-full border",
                    order.payment_status === "paid"
                      ? "bg-green-100 text-green-700 border-green-300"
                      : "bg-yellow-100 text-yellow-700 border-yellow-300"
                  )}
                >
                  {order.payment_status_display}
                </span>

                <span
                  className={clsx(
                    "text-xs font-semibold px-3 py-1.5 rounded-full border",
                    order.status === "processing"
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : "bg-gray-200 text-gray-700 border-gray-300"
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

      {/* Expandable Order Items */}
      <div
        className={clsx(
          "transition-all duration-500 overflow-hidden",
          expanded ? "max-h-[1000px] mt-6 border-t pt-4" : "max-h-0"
        )}
      >
        {expanded && (
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-100 rounded-lg text-sm"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {item.variant.product}{" "}
                    <span className="text-xs text-gray-500">
                      ({item.variant.color}, {item.variant.size})
                    </span>
                  </p>
                  <p className="text-gray-500">
                    <span className="text-xl">৳</span> {item.price} ×{" "}
                    {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-gray-900 text-right mt-2 sm:mt-0">
                  <span className="text-xl">৳</span>{" "}
                  {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default OrderCard;
