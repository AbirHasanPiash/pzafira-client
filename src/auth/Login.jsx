import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../auth/useAuth";
import api from "../api/axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useWishlist } from "../shop/WishlistContext";
import { useCart } from "../shop/CartContext";
import AuthContext from "./AuthProvider";


const Login = () => {
  const { refreshWishlist } = useWishlist();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { fetchCart: refreshCart } = useCart();
  const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loggedInUser = await login(form.email, form.password);
      // await login(form.email, form.password);
      await Promise.all([refreshWishlist(), refreshCart()]);
      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 3000,
      });
      setTimeout(() => { 
        if (loggedInUser.is_staff) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 100);
    } catch (err) {
      const message = err.response?.data?.detail || "Login failed. Please try again.";
      toast.error(message, {
        position: "top-center",
        autoClose: 4000,
      });
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!form.email) {
      toast.error("Please enter your email to reset password.", {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }

    try {
      await api.post("/auth/users/reset_password/", { email: form.email });
      toast.success("Password reset link sent! Check your email.", {
        position: "top-center",
        autoClose: 5000,
      });
    } catch (err) {
      const message = err.response?.data?.email?.[0] || "Password reset failed.";
      toast.error(message, {
        position: "top-center",
        autoClose: 4000,
      });
      console.error("Password reset error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-black">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="p-3 rounded-lg border focus:ring-2 focus:ring-black-300 focus:outline-none text-sm sm:text-base"
            required
          />
          
          {/* Password field with eye icon */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="p-3 rounded-lg border focus:ring-2 focus:ring-black-300 focus:outline-none text-sm sm:text-base w-full"
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

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 bg-black text-white hover:scale-101 duration-300 font-semibold py-3 rounded-lg transition-all text-sm sm:text-base ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-xs sm:text-sm text-gray-600">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0">
            <button
              onClick={() => setShowReset(!showReset)}
              className="text-blue-600 hover:underline text-left"
            >
              Forgot your password?
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span>Don't have an account?</span>
              <Link to="/register" className="text-blue-600 hover:underline">
                Register here
              </Link>
            </div>
          </div>

          {showReset && (
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={handlePasswordReset}
                className="bg-black text-white hover:scale-101 duration-300 font-semibold py-2 rounded-lg transition-all text-xs sm:text-sm"
              >
                Send Password Reset Email
              </button>
              <p className="text-gray-500 text-[10px] sm:text-xs">
                Enter your email first, then click to receive reset link.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
