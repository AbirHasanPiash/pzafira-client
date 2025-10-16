import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import api from "../api/axios";
import AuthContext from "../auth/AuthProvider";

const WishlistContext = createContext();

const initialState = {
  items: [],
  loading: false,
};

function wishlistReducer(state, action) {
  switch (action.type) {
    case "SET_WISHLIST":
      return { ...state, items: action.payload };
    case "ADD_TO_WISHLIST":
      return { ...state, items: [...state.items, action.payload] };
    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "CLEAR_WISHLIST":
      return { ...state, items: [] };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      dispatch({ type: "SET_WISHLIST", payload: JSON.parse(saved) });
    }
  }, []);

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await api.get("/wishlist/api/wishlist/");
      dispatch({ type: "SET_WISHLIST", payload: res.data.results });
      localStorage.setItem("wishlist", JSON.stringify(res.data.results));
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
      const fallback = localStorage.getItem("wishlist");
      if (fallback) {
        dispatch({ type: "SET_WISHLIST", payload: JSON.parse(fallback) });
      }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [dispatch]);

  const clearLocalWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
  };

  // Listen for logout event and clear local wishlist
  useEffect(() => {
    const handleLogout = () => {
      dispatch({ type: "CLEAR_WISHLIST" });
    };

    window.addEventListener("user-logged-out", handleLogout);
    return () => window.removeEventListener("user-logged-out", handleLogout);
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchWishlist();
    }
  }, [user?.id]);

  return (
    <WishlistContext.Provider
      value={{
        ...state,
        dispatch,
        clearLocalWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
