import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const primaryImage = product.images.find(img => img.is_primary)?.image || "/images/default_img.png";
  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <img
        src={primaryImage}
        alt={product.name}
        className="w-full h-60 object-cover"
        loading="lazy"
      />
      <div className="p-2 flex flex-col justify-between h-[160px]">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{product.category} • {product.brand}</p>
        </div>
        <div className="mt-1">
          <Link
            to={`/admin/product/${product.id}`}
            className="inline-block text-center bg-black hover:bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-medium w-full"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
