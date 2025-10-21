import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center p-6 md:p-10 rounded-2xl shadow-xl bg-white w-full max-w-md">
        <FaCheckCircle className="text-green-500 text-6xl md:text-7xl mx-auto mb-4" />
        <h1 className="text-xl md:text-2xl font-bold mb-2">Payment Successful</h1>
        <p className="text-sm md:text-base text-gray-600 mb-4">
          Thank you for your order! We're now processing it.
        </p>
        <Link
          name="dashboard-btn"
          to="/dashboard"
          className="inline-block w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition text-sm md:text-base"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;