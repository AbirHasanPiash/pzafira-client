import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";
import { RouteFallback } from "../components/Skeletons";

/**
 * Gate for routes that require a signed-in user.
 *
 * While the session is still being restored we render a placeholder instead of
 * redirecting, so a reload on a protected page does not bounce the user to the
 * login screen before their token has been verified.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <RouteFallback />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
