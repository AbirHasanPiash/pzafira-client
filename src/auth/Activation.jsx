import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/axios";

const Activation = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const activateAccount = async () => {
      try {
        await api.post("/auth/users/activation/", { uid, token });
        setSuccess(true);
        toast.success("🎉 Your account has been activated!", {
          position: "top-center",
          autoClose: 3000,
        });

        setTimeout(() => {
          navigate("/welcome");
        }, 1500); 
      } catch (err) {
        const serverMessage = err.response?.data?.detail || "";
        const friendlyMessage = serverMessage.includes("Stale token")
          ? "This activation link has already been used. Please login."
          : serverMessage || "Activation failed. Please try again.";

        toast.error(friendlyMessage, {
          position: "top-center",
          autoClose: 4000,
        });
      } finally {
        setLoading(false);
      }
    };

    activateAccount();
  }, [uid, token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-2">
          {loading ? (
            <>
              Activating Your Account...
              <span className="loading loading-spinner text-neutral"></span>
            </>
          ) : success ? (
            "Activation Successful"
          ) : (
            "Activation Failed"
          )}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-8">
          {loading
            ? "Please wait while we verify your activation link."
            : success
            ? "Your account is now active! Redirecting you to the welcome page..."
            : "There was a problem activating your account. Please check the activation link or try again."}
        </p>
      </div>
    </div>
  );
};

export default Activation;
