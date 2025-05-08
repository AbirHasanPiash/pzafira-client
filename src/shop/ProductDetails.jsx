import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { Star, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "./CartContext";
import ProductReviews from "./ProductReviews";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingAddToCart, setLoadingAddToCart] = useState(false);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  const fetchProduct = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await api.get(`/products/api/detail-products/${id}/`);
      setProduct(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load product details.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    setSelectedColor("");
    setSelectedSize("");
    setSelectedVariant(null);
    setQuantity(1);
  }, [product]);

  useEffect(() => {
    if (product) {
      const variant = product.variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize
      );
      setSelectedVariant(variant || null);

      if (variant) setQuantity(1);
    }
  }, [selectedColor, selectedSize, product]);

  const fetchReviewsAgain = () => {
    fetchProduct();
  };

  const handleAddToCart = async () => {
    setLoadingAddToCart(true);

    if (!selectedVariant) {
      toast.error("Please select color and size!");
      setLoadingAddToCart(false);
      return;
    }
    if (selectedVariant.stock <= 0) {
      toast.error("Selected variant is out of stock.");
      setLoadingAddToCart(false);
      return;
    }
    if (quantity < 1 || quantity > selectedVariant.stock) {
      toast.error("Invalid quantity selected.");
      setLoadingAddToCart(false);
      return;
    }

    const payload = {
      variant: {
        product: product.name,
        color: selectedVariant.color,
        size: selectedVariant.size,
        stock: selectedVariant.stock,
        price: selectedVariant.price,
      },
      variant_detail: selectedVariant.id,
      quantity,
    };

    try {
      await addToCart(payload);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart.");
    } finally {
      setLoadingAddToCart(false);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const incrementQuantity = () => {
    if (quantity < selectedVariant.stock) {
      setQuantity((prev) => Number(prev) + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => Number(prev) - 1);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="spinner"></div>
      </div>
    );

  if (error)
    return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="w-full">
          <div className="relative w-full">
            <img
              src={product.images[currentImageIndex]?.image}
              alt={product.name}
              className="rounded-lg shadow-md w-full h-[400px] object-contain bg-white"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
          <p className="text-sm text-gray-600">
            {product.category} | {product.brand}
          </p>
          <p className="text-gray-700 text-sm">{product.description}</p>

          {/* Variant Selection */}
          <div className="flex flex-col space-y-3">
            <div>
              <label className="font-semibold text-sm">Color:</label>
              <select
                className="w-full p-2 border rounded-md mt-1"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                <option value="">Available Color</option>
                {[...new Set(product.variants.map((v) => v.color))].map(
                  (color, idx) => (
                    <option key={idx} value={color}>
                      {color}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="font-semibold text-sm">Size:</label>
              <select
                className="w-full p-2 border rounded-md mt-1"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Available Size</option>
                {[...new Set(product.variants.map((v) => v.size))].map(
                  (size, idx) => (
                    <option key={idx} value={size}>
                      {size}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Quantity Section */}
          {selectedVariant ? (
            <div className="flex items-center gap-3 mt-2">
              <label className="font-semibold text-sm">Quantity:</label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <button
                  onClick={decrementQuantity}
                  className="bg-gray-200 hover:bg-gray-300 p-2"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  min="1"
                  max={selectedVariant.stock}
                  value={quantity}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setQuantity("");
                    } else if (/^\d+$/.test(val)) {
                      const num = Number(val);
                      if (num <= selectedVariant.stock) {
                        setQuantity(num);
                      }
                    }
                  }}
                  onBlur={() => {
                    if (!quantity || quantity < 1) {
                      setQuantity(1);
                    }
                  }}
                  className="w-20 text-center outline-none"
                />
                <button
                  onClick={incrementQuantity}
                  className="bg-gray-200 hover:bg-gray-300 p-2"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="text-xs text-gray-500">
                (Available: {selectedVariant.stock})
              </span>
            </div>
          ) : (
            selectedColor &&
            selectedSize && (
              <div className="mt-2 p-3 bg-yellow-100 text-yellow-700 rounded-md text-sm">
                Selected color and size combination is not available.
              </div>
            )
          )}

          {/* Selected Variant Info */}
          {selectedVariant && (
            <div className="border p-3 rounded-md mt-3 text-sm space-y-1">
              <p>
                <strong>Unit Price:</strong> <span className="text-xl">৳</span>
                {selectedVariant.price}
              </p>
              <p>
                <strong>Stock:</strong> {selectedVariant.stock}
              </p>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={loadingAddToCart}
            className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition mt-4"
          >
            {loadingAddToCart ? "Adding to Cart..." : "Add to Cart"}
          </button>

          {/* Rating */}
          <div className="flex items-center space-x-2 mt-5">
            <Star className="text-yellow-400" size={18} />
            <p className="text-md font-semibold">
              {product.average_rating} / 5
            </p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ProductReviews
        reviews={product.reviews}
        productId={product.id}
        onReviewChange={fetchReviewsAgain}
      />
    </div>
  );
};

export default ProductDetails;
