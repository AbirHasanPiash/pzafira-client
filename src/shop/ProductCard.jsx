import { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useWishlist } from "./WishlistContext";

const ProductCard = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const { items: wishlist, dispatch } = useWishlist();

  const variantId = product.variants?.[0]?.id;
  const wishlistItem = wishlist.find((item) => item.variant.id === variantId);
  const isWishlisted = !!wishlistItem;

  const primaryImage =
    product.images?.[0]?.image ||
    "https://via.placeholder.com/300x400?text=No+Image";

  const toggleWishlist = async () => {
    if (!variantId) {
      toast.error("No variant to wishlist!");
      return;
    }

    try {
      setLoading(true);
      if (isWishlisted) {
        await api.delete(`/wishlist/api/wishlist/${wishlistItem.id}/`);
        dispatch({ type: "REMOVE_FROM_WISHLIST", payload: wishlistItem.id });
        toast.success("Removed from wishlist");
      } else {
        const res = await api.post("/wishlist/api/wishlist/", {
          variant_id: variantId,
          image: primaryImage,
        });
        dispatch({ type: "ADD_TO_WISHLIST", payload: res.data });
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="rounded-lg p-4 shadow hover:shadow-lg transition relative group bg-white flex flex-col justify-between">
      <Link to={`/shop/${product.id}`}>
        <div className="w-full h-56 overflow-hidden rounded-md mb-4 bg-gray-100">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform"
          />
        </div>
      </Link>

      <div className="flex flex-col gap-2">
        <h3 className="text-xs md:text-sm font-semibold line-clamp-2">
          {product.name}
        </h3>
        <h4 className="text-base sm:text-md font-semibold">
          <span className="text-md sm:text-xl font-semibold">৳</span>
          {product.variants[0].price}
        </h4>

        <Link to={`/shop/${product.id}`}>
          <button className="text-xs font-medium text-white bg-black px-3 py-1 rounded-md hover:bg-gray-800 transition">
            Details
          </button>
        </Link>
      </div>

      <button
        onClick={toggleWishlist}
        className="absolute bottom-3 right-3 text-gray-500 hover:text-red-500 text-xl z-10 transition-transform hover:scale-110"
        disabled={loading}
      >
        {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
      </button>
    </div>
  );
};

export default ProductCard;
