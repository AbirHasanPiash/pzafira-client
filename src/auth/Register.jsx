import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AnimatedButton from "../components/AnimatedButton";

const Register = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    re_password: ""
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/users/", form);
      setSubmitted(true);
      toast.success("Registration successful! Please check your email.", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (err) {
      const errorData = err.response?.data;
      const message = errorData
        ? Object.values(errorData).flat().join(" ")
        : "Registration failed. Please try again.";
      setError(message);
      toast.error(message, {
        position: "top-center",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await api.post("/auth/users/resend_activation/", { email: form.email });
      toast.success("Activation email resent!", {
        position: "top-center",
        autoClose: 5000,
      });
    } catch (err) {
      const msg = err.response?.data?.email?.[0] || "Resend failed.";
      toast.error(msg, {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 mb-20 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-black">
          Create Account
        </h2>

        {submitted ? (
          <div className="text-center space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold text-green-600">
              Registration Successful!
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Please check your email to activate your account.
            </p>
            <button
              onClick={handleResend}
              disabled={loading}
              className={`${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="flex justify-center">
                <AnimatedButton text={loading ? "Sending activation email..." : "Resend Activation Email"} />
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              name="first_name"
              placeholder="First Name"
              value={form.first_name}
              onChange={handleChange}
              className="p-2 sm:p-3 rounded-lg border focus:ring-2 focus:ring-black-300 focus:outline-none text-sm sm:text-base"
              required
            />
            <input
              name="last_name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={handleChange}
              className="p-2 sm:p-3 rounded-lg border focus:ring-2 focus:ring-black-300 focus:outline-none text-sm sm:text-base"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="p-2 sm:p-3 rounded-lg border focus:ring-2 focus:ring-black-300 focus:outline-none text-sm sm:text-base"
              required
            />
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="p-2 w-full sm:p-3 rounded-lg border focus:ring-2 focus:ring-black-300 focus:outline-none text-sm sm:text-base"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div >
            <div className="relative">
              <input
                name="re_password"
                type={showRePassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={form.re_password}
                onChange={handleChange}
                className="p-2 sm:p-3 w-full rounded-lg border focus:ring-2 focus:ring-black-300 focus:outline-none text-sm sm:text-base"
                required
              />
              <button
                type="button"
                onClick={() => setShowRePassword(!showRePassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showRePassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-2 bg-black text-white hover:scale-101 duration-300 font-semibold py-2 sm:py-3 rounded-lg transition-all ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        )}

        {!submitted && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;