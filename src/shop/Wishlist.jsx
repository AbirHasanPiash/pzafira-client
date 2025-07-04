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
    <div className="container px-6 sm:px-10 md:px-16 max-w-7xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Wishlist</h1>
        <Link
          to="/shop"
          className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 transition"
        >
          &larr; Back to Shop
        </Link>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
          >
            {/* Image Section */}
            <Link
              to={`/shop/${item.variant.product_id}`}
              className="relative overflow-hidden"
            >
              <img
                src={item.image || "/images/default_img.png"}
                alt={item.variant?.product}
                className="w-full max-h-48 object-contain bg-gray-50 p-3 transition-transform duration-300 hover:scale-105"
              />
            </Link>

            {/* Info Section */}
            <div className="px-4 pt-2 pb-4 flex flex-col flex-grow">
              <h2 className="text-base font-semibold text-gray-800 truncate">
                {item.variant.product}
              </h2>

              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Color:</span> {item.variant.color}
                <span className="mx-1 text-gray-400">|</span>
                <span className="font-medium">Size:</span> {item.variant.size}
              </p>

              <p className="text-base font-bold text-gray-900 mt-2">
                <span className="text-xl">৳</span>
                {item.variant.price}
              </p>

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(item.id)}
                className="mt-4 w-full text-sm bg-red-100 text-red-600 py-2 rounded-md hover:bg-red-600 hover:text-white transition"
              >
                Remove from Wishlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
