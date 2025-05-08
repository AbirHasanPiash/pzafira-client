import { FaTimesCircle } from "react-icons/fa";

const PaymentFail = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center p-6 md:p-10 rounded-2xl shadow-xl bg-white w-full max-w-md">
        <FaTimesCircle className="text-red-500 text-6xl md:text-7xl mx-auto mb-4" />
        <h1 className="text-xl md:text-2xl font-bold mb-2">Payment Failed</h1>
        <p className="text-sm md:text-base text-gray-600 mb-4">
          Something went wrong with your payment. Please try again.
        </p>
        <a
          href="/cart"
          className="inline-block w-full md:w-auto px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition text-sm md:text-base"
        >
          Back to Cart
        </a>
      </div>
    </div>
  );
};

export default PaymentFail;