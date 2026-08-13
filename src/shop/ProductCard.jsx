import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { preload } from "swr";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import api from "../api/axios";
import fetcher from "../api/fetcher";
import { toast } from "react-toastify";
import { useWishlist } from "./WishlistContext";

const FALLBACK_IMAGE = "/images/default_img.webp";

const ProductCard = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const { items: wishlist, dispatch } = useWishlist();

  const variantId = product.variants?.[0]?.id;
  const wishlistItem = wishlist.find((item) => item.variant?.id === variantId);
  const isWishlisted = !!wishlistItem;

  // A product without variants has no price to show; fall back to a dash rather
  // than reading straight through `variants[0]`, which used to throw.
  const price = product.variants?.[0]?.price;
  const primaryImage = product.images?.[0]?.image || FALLBACK_IMAGE;
  const detailHref = `/shop/${product.id}`;

  /**
   * Warms the detail endpoint while the pointer is still travelling to the
   * card. By the time the route chunk mounts, the response is usually already
   * in the SWR cache, so the page renders with data on its first paint.
   */
  const prefetchDetails = () =>
    preload(`/products/api/detail-products/${product.id}/`, fetcher);

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
    <div
      className="rounded-lg p-4 shadow hover:shadow-lg transition relative group bg-white flex flex-col justify-between"
      onMouseEnter={prefetchDetails}
      onFocusCapture={prefetchDetails}
    >
      <Link to={detailHref}>
        <div className="w-full h-56 overflow-hidden rounded-md mb-4 bg-gray-100">
          <img
            src={primaryImage}
            alt={product.name}
            width="300"
            height="224"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
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
          {price ?? "—"}
        </h4>

        <Link to={detailHref}>
          <button className="text-xs font-medium text-white bg-black px-3 py-1 rounded-md hover:bg-gray-800 transition">
            Details
          </button>
        </Link>
      </div>

      <button
        onClick={toggleWishlist}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute bottom-3 right-3 text-gray-500 hover:text-red-500 text-xl z-10 transition-transform hover:scale-110"
        disabled={loading}
      >
        {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
      </button>
    </div>
  );
};

// The grid re-renders on every keystroke in the search box; cards whose product
// object is unchanged skip re-rendering entirely.
export default memo(ProductCard);
