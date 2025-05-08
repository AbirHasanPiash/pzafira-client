// // // src/shop/ProductCard.jsx

// // import { useState } from "react";
// // import { Link } from "react-router-dom";
// // import { FaRegHeart, FaHeart } from "react-icons/fa";

// // const ProductCard = ({ product }) => {
// //   const [isWishlisted, setIsWishlisted] = useState(false);

// //   const toggleWishlist = () => {
// //     setIsWishlisted(!isWishlisted);
// //     // Future: send API request to add/remove wishlist
// //   };

// //   const primaryImage = product.images?.length > 0 
// //     ? product.images[0].image 
// //     : "https://via.placeholder.com/300x400?text=No+Image"; // fallback if no image

// //   return (
// //     <div className="rounded-lg p-4 shadow hover:shadow-lg transition relative group bg-white flex flex-col justify-between">
// //       {/* Product Image */}
// //       <Link to={`/products/${product.id}`}>
// //         <div className="w-full h-56 overflow-hidden rounded-md mb-4 bg-gray-100">
// //           <img
// //             src={primaryImage}
// //             alt={product.name}
// //             className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 ease-in-out"
// //           />
// //         </div>
// //       </Link>

// //       {/* Product Info */}
// //       <div>
// //         <h3 className="text-xs md:text-sm font-semibold min-h-[48px]">
// //           {product.name}
// //         </h3>

// //         <Link to={`/shop/${product.id}`}>
// //           <button className="text-xs font-medium text-white bg-black px-3 py-1 rounded-md hover:bg-gray-800 transition">
// //             Details
// //           </button>
// //         </Link>
// //       </div>

// //       {/* Wishlist Button (bottom-right with hover animation) */}
// //       <button
// //         onClick={toggleWishlist}
// //         className="absolute bottom-3 right-3 text-gray-500 hover:text-red-500 text-xl z-10 transition-transform duration-300 hover:scale-110"
// //       >
// //         {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
// //       </button>
// //     </div>
// //   );
// // };

// // export default ProductCard;


// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { FaRegHeart, FaHeart } from "react-icons/fa";
// import api from "../api/axios";
// import { toast } from "react-toastify";
// import { useWishlist } from "./WishlistContext";

// const ProductCard = ({ product }) => {
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { dispatch } = useWishlist();

//   const primaryImage = product.images?.length > 0 
//     ? product.images[0].image 
//     : "https://via.placeholder.com/300x400?text=No+Image"; // fallback

//   // Get first variant id safely
//   const variantId = product.variants?.[0]?.id;

//   // ⚡️ Load initial wishlist status from backend
//   useEffect(() => {
//     const checkWishlist = async () => {
//       if (!variantId) return;
//       try {
//         const response = await api.get("/wishlist/api/wishlist/");
//         const wishlistVariantIds = response.data.results.map(item => item.variant.id);
//         setIsWishlisted(wishlistVariantIds.includes(variantId));
//       } catch (error) {
//         console.error("Error checking wishlist:", error);
//       }
//     };

//     checkWishlist();
//   }, [variantId]);

//   const toggleWishlist = async () => {
//     if (isWishlisted) {
//       // remove
//       await api.delete(`/wishlist/api/wishlist/${wishlistItem.id}/`);
//       dispatch({ type: "REMOVE_FROM_WISHLIST", payload: wishlistItem.id });
//       setIsWishlisted(false);
//     } else {
//       const res = await api.post("/wishlist/api/wishlist/", { variant_id: variantId });
//       dispatch({ type: "ADD_TO_WISHLIST", payload: res.data }); // assuming the new item is returned
//       setIsWishlisted(true);
//     }
//     if (!variantId) {
//       toast.error("No variant available to add to wishlist!");
//       return;
//     }
  
//     try {
//       setLoading(true);
//       if (isWishlisted) {
//         // First, find the corresponding WishlistItem ID
//         const response = await api.get("/wishlist/api/wishlist/");
//         const wishlistItem = response.data.results.find(
//           item => item.variant.id === variantId
//         );
  
//         if (!wishlistItem) {
//           toast.error("Wishlist item not found!");
//           return;
//         }
  
//         // Now delete by wishlist item's ID
//         await api.delete(`/wishlist/api/wishlist/${wishlistItem.id}/`);
//         toast.success("Removed from wishlist");
//         setIsWishlisted(false);
//       } else {
//         // Add to wishlist (POST)
//         await api.post("/wishlist/api/wishlist/", { variant_id: variantId });
//         toast.success("Added to wishlist");
//         setIsWishlisted(true);
//       }
//     } catch (error) {
//       console.error("Error toggling wishlist:", error);
//       toast.error("Something went wrong!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="rounded-lg p-4 shadow hover:shadow-lg transition relative group bg-white flex flex-col justify-between">
      
//       {/* Product Image */}
//       <Link to={`/shop/${product.id}`}>
//         <div className="w-full h-56 overflow-hidden rounded-md mb-4 bg-gray-100">
//           <img
//             src={primaryImage}
//             alt={product.name}
//             className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 ease-in-out"
//           />
//         </div>
//       </Link>

//       {/* Product Info */}
//       <div className="flex flex-col gap-2">
//         <h3 className="text-xs md:text-sm font-semibold min-h-[48px] line-clamp-2">
//           {product.name}
//         </h3>

//         <Link to={`/shop/${product.id}`}>
//           <button className="text-xs font-medium text-white bg-black px-3 py-1 rounded-md hover:bg-gray-800 transition">
//             Details
//           </button>
//         </Link>
//       </div>

//       {/* Wishlist Button */}
//       <button
//         onClick={toggleWishlist}
//         className="absolute bottom-3 right-3 text-gray-500 hover:text-red-500 text-xl z-10 transition-transform duration-300 hover:scale-110"
//         disabled={loading}
//       >
//         {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
//       </button>

//     </div>
//   );
// };

// export default ProductCard;



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
  const wishlistItem = wishlist.find(item => item.variant.id === variantId);
  const isWishlisted = !!wishlistItem;

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
        const res = await api.post("/wishlist/api/wishlist/", { variant_id: variantId });
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

  const primaryImage = product.images?.[0]?.image 
    || "https://via.placeholder.com/300x400?text=No+Image";

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
        <h3 className="text-xs md:text-sm font-semibold min-h-[48px] line-clamp-2">
          {product.name}
        </h3>
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
