import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useOrders } from "../shop/OrdersContext";
import { FaBoxOpen } from "react-icons/fa";
import OrderCard from "./OrderCard";
import AuthContext from "../auth/AuthProvider";

const OrdersPage = () => {
  const { items: orders, fetchOrders, count, next, previous } = useOrders();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(count / 100);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [fetchOrders, currentPage]);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  
  return (
    <div className="max-w-6xl min-h-screen mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">All Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center min-h-screen text-gray-500 mt-20">
          <FaBoxOpen className="mx-auto text-5xl mb-4 text-gray-400" />
          <p>No orders found</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isStaff={user?.is_staff}
              refresh={() => fetchOrders(currentPage)}
            />
          ))}
        </div>
      )}
      <div className="flex justify-center mt-10 gap-4 items-center">
        <button
          disabled={!previous}
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          className="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={!next}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersPage;
