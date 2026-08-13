import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../api/axios";
import useAuth from "../auth/useAuth";

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];

const STATUS_LABEL = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const PAYMENT_LABEL = {
  unpaid: "Unpaid",
  pending: "Payment pending",
  paid: "Paid",
  failed: "Payment failed",
  refunded: "Refunded",
};

/**
 * Looks the order up in the signed-in customer's own order history.
 *
 * The API scopes `/orders/api/orders/` to the authenticated user, so this can
 * only ever surface an order that belongs to the person asking — no separate
 * guest-lookup endpoint is needed, and none is exposed.
 */
const OrderTracking = () => {
  const { user } = useAuth();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const findOrder = async (id) => {
    // Walk the paginated history until the id turns up.
    let url = "/orders/api/orders/";
    while (url) {
      const { data } = await api.get(url);
      const match = (data.results || []).find(
        (candidate) => String(candidate.id) === id
      );
      if (match) return match;
      url = data.next ? data.next.replace(api.defaults.baseURL, "") : null;
    }
    return null;
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const found = await findOrder(orderId.trim().replace(/^#/, ""));
      if (found) {
        setOrder(found);
      } else {
        setError("No order with that ID was found on your account.");
      }
    } catch (err) {
      console.error("Order tracking failed:", err);
      setError("We couldn't reach the order service. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <section className="min-h-[70vh] py-14 px-6 sm:px-10 md:px-16 bg-white text-gray-800">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Track Your Order</h1>
          <p className="text-gray-600">
            Sign in to see the status of every order placed on your account.
          </p>
          <Link
            to="/login"
            className="inline-block rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Sign in to continue
          </Link>
        </div>
      </section>
    );
  }

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1;
  const cancelled = order?.status === "cancelled";

  return (
    <section className="min-h-screen py-14 px-6 sm:px-10 md:px-16 bg-white text-gray-800">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold">Track Your Order</h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
            Enter an order ID to see its latest status. You can find your IDs on
            the{" "}
            <Link to="/orders" className="font-medium underline">
              orders page
            </Link>
            .
          </p>
        </div>

        <form
          onSubmit={handleTrack}
          className="bg-white p-6 rounded-md shadow-sm space-y-5"
        >
          <div className="space-y-2">
            <label htmlFor="order-id" className="block text-sm font-medium">
              Order ID
            </label>
            <input
              id="order-id"
              type="text"
              required
              inputMode="numeric"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. 1042"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white flex items-center justify-center gap-2 px-6 py-2 rounded-md font-medium transition hover:bg-gray-800 disabled:opacity-60"
          >
            <Search size={18} />
            {loading ? "Searching…" : "Track Order"}
          </button>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </form>

        {order && (
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-md space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Order #{order.id}</h2>
              <span className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium">
                {PAYMENT_LABEL[order.payment_status] ?? order.payment_status}
              </span>
            </div>

            <p className="text-sm text-gray-600">
              <strong>Placed on:</strong>{" "}
              {new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            {cancelled ? (
              <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                This order was cancelled.
              </p>
            ) : (
              <ol className="flex flex-wrap gap-3">
                {STATUS_STEPS.map((step, index) => {
                  const reached = index <= currentStep;
                  return (
                    <li
                      key={step}
                      className={`flex-1 min-w-[7rem] rounded-md border px-3 py-2 text-center text-xs font-medium ${
                        reached
                          ? "border-green-300 bg-green-50 text-green-800"
                          : "border-gray-200 bg-white text-gray-400"
                      }`}
                    >
                      {STATUS_LABEL[step]}
                    </li>
                  );
                })}
              </ol>
            )}

            {order.items?.length > 0 && (
              <div className="pt-2">
                <strong className="mb-2 block text-sm text-gray-700">Items</strong>
                <ul className="space-y-1 text-sm text-gray-600">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.variant?.product}
                      {item.variant?.color && item.variant?.size && (
                        <span className="text-gray-400">
                          {" "}
                          ({item.variant.color}, {item.variant.size})
                        </span>
                      )}{" "}
                      &times; {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderTracking;
