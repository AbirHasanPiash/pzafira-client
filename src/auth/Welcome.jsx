import { Link } from "react-router-dom";
import AnimatedButton from "../components/AnimatedButton";

const Welcome = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl max-w-md w-full text-center animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
          Welcome to Pzafira!
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8">
          Your account has been successfully activated. <br /> Let’s get started!
        </p>
        <Link
          to="/login"
        >
          <div className="flex justify-center">
          <AnimatedButton text="Go to Login"/>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
