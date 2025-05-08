import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import api from "../api/axios";
import AuthContext from "../auth/AuthProvider";
import { toast } from "react-toastify";

const OrdersContext = createContext();

const initialState = {
  items: [],
  count: 0,
  next: null,
  previous: null,
  loading: false,
  fetchingFreshData: false,
};

function ordersReducer(state, action) {
  switch (action.type) {
    case "SET_ORDERS":
      return {
        ...state,
        items: action.payload.items,
        count: action.payload.count,
        next: action.payload.next,
        previous: action.payload.previous,
        loading: false,
        fetchingFreshData: false,
      };
    case "FETCHING_FRESH_ORDERS":
      return { ...state, fetchingFreshData: true };
      case "CLEAR_ORDERS":
        return {
          ...state,
          items: [],
          count: 0,
          next: null,
          previous: null,
        };
    default:
      return state;
  }
}

export const OrdersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ordersReducer, initialState);
  const { user } = useContext(AuthContext);

  const fetchOrders = useCallback(async (page = 1) => {
    dispatch({ type: "FETCHING_FRESH_ORDERS" });
  
    try {
      const res = await api.get(`/orders/api/orders/?page=${page}`);
      const data = res.data;
  
      const payload = {
        items: data.results || [],
        count: data.count || 0,
        next: data.next,
        previous: data.previous,
      };
  
      localStorage.setItem("userOrders", JSON.stringify(payload.items));
  
      dispatch({ type: "SET_ORDERS", payload }); // ✅ correct format
    } catch (err) {
      toast.error("Failed to fetch orders.");
      console.error("Fetch orders error:", err);
  
      const fallback = localStorage.getItem("userOrders");
      if (fallback) {
        dispatch({
          type: "SET_ORDERS",
          payload: {
            items: JSON.parse(fallback),
            count: 0,
            next: null,
            previous: null,
          },
        });
      }
    }
  }, []);

  const clearLocalOrders = () => {
    dispatch({ type: "CLEAR_ORDERS" });
  };

  // Logout listener
  useEffect(() => {
    const handleLogout = () => {
      dispatch({ type: "CLEAR_ORDERS" });
      localStorage.removeItem("userOrders");
    };

    window.addEventListener("user-logged-out", handleLogout);
    return () => window.removeEventListener("user-logged-out", handleLogout);
  }, []);

  useEffect(() => {
    const cachedOrders = localStorage.getItem("userOrders");
    if (cachedOrders) {
      dispatch({
        type: "SET_ORDERS",
        payload: {
          items: JSON.parse(cachedOrders),
          count: 0,
          next: null,
          previous: null,
        },
      });
    }
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  return (
    <OrdersContext.Provider
      value={{
        ...state,
        dispatch,
        fetchOrders,
        clearLocalOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
