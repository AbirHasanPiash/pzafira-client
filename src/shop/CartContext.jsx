import { createContext, useContext, useReducer, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import AuthContext from "../auth/AuthProvider";

const CartContext = createContext();

const initialState = {
  items: [],
  loading: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "SET_CART":
      return { ...state, items: action.payload, loading: false };
    case "ADD_TO_CART":
      return { ...state, items: [...state.items, action.payload] };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart/api/cart-items/");
      const cartItems = res.data.results || [];
  
      dispatch({ type: "SET_CART", payload: cartItems });
  
      if (cartItems.length > 0 && cartItems[0].cart) {
        localStorage.setItem("cartId", cartItems[0].cart);
      } else {
        localStorage.removeItem("cartId");
      }
    } catch (err) {
      toast.error("Failed to fetch cart.");
    }
  };

  const addToCart = async (payload) => {
    try {
      const res = await api.post("/cart/api/cart-items/", payload);
      dispatch({ type: "ADD_TO_CART", payload: res.data });
      toast.success(`${payload.quantity} item(s) added to cart!`);
      fetchCart(); // optionally keep to sync with server state
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        toast.error("Please login to add items to cart.");
      } else {
        toast.error(error.response?.data?.[0] || "Something went wrong.");
      }
    }
  };

  const clearLocalCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) return;

    try {
      await api.patch(`/cart/api/cart-items/${itemId}/`, {
        quantity: newQuantity,
      });
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id: itemId, quantity: newQuantity },
      });
      toast.success("Quantity updated!");
      fetchCart(); // optional for accuracy
    } catch (err) {
      toast.error("Failed to update quantity.");
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await api.delete(`/cart/api/cart-items/${itemId}/`);
      dispatch({ type: "REMOVE_FROM_CART", payload: itemId });
      toast.success("Item removed from cart.");
    } catch (err) {
      toast.error("Failed to remove item.");
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart/api/cart/clear/");
      dispatch({ type: "CLEAR_CART" });
      toast.success("Cart cleared.");
    } catch (err) {
      toast.error("Failed to clear cart.");
    }
  };

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  useEffect(() => {
    const handleLogout = () => {
      dispatch({ type: "CLEAR_CART" });
      localStorage.removeItem("cartId");
    };
  
    window.addEventListener("user-logged-out", handleLogout);
    return () => window.removeEventListener("user-logged-out", handleLogout);
  }, []);

  return (
    <CartContext.Provider
      value={{
        ...state,
        dispatch,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        clearLocalCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
