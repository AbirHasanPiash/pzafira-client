import { FaExclamationTriangle } from "react-icons/fa";

const PaymentCancel = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center p-6 md:p-10 rounded-2xl shadow-xl bg-white w-full max-w-md">
        <FaExclamationTriangle className="text-yellow-500 text-6xl md:text-7xl mx-auto mb-4" />
        <h1 className="text-xl md:text-2xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-sm md:text-base text-gray-600 mb-4">
          You cancelled the payment. You can always try again later.
        </p>
        <a
          href="/cart"
          className="inline-block w-full md:w-auto px-6 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition text-sm md:text-base"
        >
          Back to Cart
        </a>
      </div>
    </div>
  );
};

export default PaymentCancel;
