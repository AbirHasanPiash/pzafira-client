import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../auth/AuthProvider";

const AccountModal = ({ closeModal }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    closeModal();
    navigate("/");
  };

  const handleLinkClick = () => {
    closeModal();
  };

  return (
    <div className="absolute top-10 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md p-4 w-40 z-50 fade-slide-down">
      <div className="flex flex-col gap-2 text-sm font-medium">
        {user ? (
          <>
            <Link
              to={user.is_staff ? "/admin" : "/dashboard"}
              onClick={handleLinkClick}
              className="hover:bg-gray-100 px-3 py-2 rounded transition"
            >
              {user.first_name} {user.last_name}
            </Link>
            <Link
              to={user.is_staff ? "/admin" : "/dashboard"}
              onClick={handleLinkClick}
              className="hover:bg-gray-100 px-3 py-2 rounded transition"
            >
              Dashboard
            </Link>
            {/* <Link
              to="/profile"
              onClick={handleLinkClick}
              className="hover:bg-gray-100 px-3 py-2 rounded transition"
            >
              Profile
            </Link> */}
            <button
              onClick={handleLogout}
              className="text-left hover:bg-gray-100 px-3 py-2 rounded transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              onClick={handleLinkClick}
              className="hover:bg-gray-100 px-3 py-2 rounded transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={handleLinkClick}
              className="hover:bg-gray-100 px-3 py-2 rounded transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountModal;
