import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, HeartOff } from "lucide-react";
import { useWishlist } from "./WishlistContext";
import api from "../api/axios";

const Wishlist = () => {
  const { items: wishlistItems, dispatch, refreshWishlist } = useWishlist();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      const cached = localStorage.getItem("wishlist");
      if (cached) {
        dispatch({ type: "SET_WISHLIST", payload: JSON.parse(cached) });
        setLoading(false);
      }
      try {
        await refreshWishlist();
      } catch (error) {
        console.error("Failed to load wishlist:", error);
        toast.error("Failed to load wishlist.");
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [refreshWishlist, dispatch]);

  const handleRemove = async (wishlistItemId) => {
    try {
      await api.delete(`/wishlist/api/wishlist/${wishlistItemId}/`);
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: wishlistItemId });
      toast.success("Removed from wishlist.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <HeartOff className="w-10 h-10 text-gray-400 mb-4" />
        <p className="text-lg text-gray-600 mb-4">Your wishlist is empty.</p>
        <Link
          to="/shop"
          className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Wishlist</h1>
        <Link
          to="/shop"
          className="text-sm text-blue-600 hover:underline transition"
        >
          &larr; Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col"
          >
            <Link to={`/shop/${item.variant.product_id}`} className="flex-1">
              <img
                src={item.variant.image || "images/default_img.png"}
                alt={item.variant.product_name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 space-y-1">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {item.variant.product}
                </h2>
                <p className="text-sm text-gray-600">
                  Color: {item.variant.color} | Size: {item.variant.size}
                </p>
                <p className="text-base font-medium text-black">
                  ${item.variant.price}
                </p>
              </div>
            </Link>
            <button
              onClick={() => handleRemove(item.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium p-3 border-t border-gray-200 transition"
            >
              Remove from Wishlist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
