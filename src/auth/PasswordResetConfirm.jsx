import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import api from "../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AnimatedButton from "../components/AnimatedButton";

const PasswordResetConfirm = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    new_password: "",
    re_new_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/users/reset_password_confirm/", {
        uid,
        token,
        ...form,
      });
      toast.success("Password reset successful! Redirecting to login...", {
        position: "top-center",
        autoClose: 3000,
      });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const error = err.response?.data;
      const message = error
        ? Object.values(error).flat().join(" ")
        : "Password reset failed. Please try again.";
      toast.error(message, {
        position: "top-center",
        autoClose: 4000,
      });
      console.error("Password reset error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-black">
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* New Password */}
          <div className="relative">
            <input
              name="new_password"
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={form.new_password}
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
          </div>

          {/* Confirm New Password */}
          <div className="relative">
            <input
              name="re_new_password"
              type={showRePassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={form.re_new_password}
              onChange={handleChange}
              className="p-2 w-full sm:p-3 rounded-lg border focus:ring-2 focus:ring-black-300 focus:outline-none text-sm sm:text-base"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 bg-black text-white hover:scale-101 duration-300 font-semibold py-2 sm:py-3 rounded-lg transition-all ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Back to login option */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Remembered your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;
