import { useState, useContext } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../auth/AuthProvider";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/users/set_password/", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success("Password changed successfully. Please log in again.");
      logout();
      navigate("/login");
    } catch (error) {
      toast.error("Password change failed. Check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Change Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <span
                onClick={() => setShowCurrent((prev) => !prev)}
                className="absolute right-3 top-2.5 text-sm text-gray-500 cursor-pointer"
              >
                {showCurrent ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <span
                onClick={() => setShowNew((prev) => !prev)}
                className="absolute right-3 top-2.5 text-sm text-gray-500 cursor-pointer"
              >
                {showNew ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <span
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-2.5 text-sm text-gray-500 cursor-pointer"
              >
                {showConfirm ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded transition text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-black/80"
            }`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full text-center text-sm text-gray-500 hover:underline mt-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
