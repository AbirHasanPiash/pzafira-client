import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";
import { RouteFallback } from "../components/Skeletons";

/**
 * Gate for the admin console.
 *
 * The API is the real authority on permissions; this guard stops the admin
 * shell from rendering for visitors who cannot use it, which avoids a screen
 * full of failed requests and keeps the admin surface out of view.
 */
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <RouteFallback />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user.is_staff) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
