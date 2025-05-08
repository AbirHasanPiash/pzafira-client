import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { Pencil, Trash, Plus } from "lucide-react";
import { toast } from "react-toastify";
import AddVariantModal from "./AddVariantModal";
import ImageUploadModal from "./ImageUploadModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isVariantModalOpen, setVariantModalOpen] = useState(false);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const res = await api.get(`/products/api/detail-products/${id}/`);
    setProduct(res.data);
  };

  const handleDeleteVariant = async (variantId) => {
    try {
      await api.delete(
        `/products/api/detail-products/${id}/variants/${variantId}/`
      );
      toast.success("Variant deleted successfully");
      fetchProduct();
    } catch (err) {
      toast.error("Failed to delete variant");
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await api.delete(
        `/products/api/detail-products/${id}/images/${imageId}/`
      );
      toast.success("Image deleted successfully");
      fetchProduct();
    } catch (err) {
      toast.error("Failed to delete image");
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await api.delete(`/products/api/detail-products/${id}/`);
      toast.success("Product deleted successfully");
      setDeleteModalOpen(false);
      window.location.href = "/admin/products"; // or redirect wherever needed
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  if (!product) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">{product.name}</h1>
      <p className="mb-2 text-gray-700 text-sm sm:text-base">
        {product.description}
      </p>
      <p className="mb-1 text-sm">
        <strong>Brand:</strong> {product.brand}
      </p>
      <p className="mb-4 text-sm">
        <strong>Category:</strong> {product.category}
      </p>

      {/* Product Images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {product.images.map((img) => (
          <div
            key={img.id}
            className="relative group overflow-hidden rounded-lg shadow-md"
          >
            <img
              src={img.image}
              alt="Product"
              className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <button
              onClick={() => handleDeleteImage(img.id)}
              className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow group-hover:scale-110 transition-transform"
            >
              <Trash className="w-5 h-5 text-red-600" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setImageModalOpen(true)}
          className="bg-black hover:bg-black/80 text-white px-3 py-2 rounded text-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add Image
        </button>
      </div>

      {/* Product Variants */}
      <h2 className="text-lg sm:text-xl font-semibold mb-2">Variants</h2>
      <div className="space-y-4">
        {product.variants.map((v) => (
          <div
            key={v.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-3 rounded-md text-sm"
          >
            <div>
              <p>
                <strong>Color:</strong> {v.color}
              </p>
              <p>
                <strong>Size:</strong> {v.size}
              </p>
              <p>
                <strong>Price:</strong> ৳{v.price}
              </p>
              <p>
                <strong>Stock:</strong> {v.stock}
              </p>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <button
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                onClick={() => {
                  setEditingVariant(v); // 🆕 Pass variant to modal
                  setVariantModalOpen(true);
                }}
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                className="p-2 bg-red-600 hover:bg-red-700 rounded text-white"
                onClick={() => handleDeleteVariant(v.id)}
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => {
            setEditingVariant(null); // 🆕 Reset editing variant
            setVariantModalOpen(true);
          }}
          className="bg-black hover:bg-black/80 text-white px-3 py-2 rounded text-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add Variant
        </button>
      </div>
      <div className="flex justify-center m-4">
        <button
          onClick={() => setDeleteModalOpen(true)}
          className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
        >
          Delete Product
        </button>
      </div>

      {/* Modal Components */}
      <AddVariantModal
        productId={id}
        isOpen={isVariantModalOpen}
        onClose={() => {
          setVariantModalOpen(false);
          setEditingVariant(null); // 🆕 Clear edit state
          fetchProduct();
        }}
        variant={editingVariant} // 🆕 Pass variant prop
      />

      <ImageUploadModal
        productId={id}
        isOpen={isImageModalOpen}
        onClose={() => {
          setImageModalOpen(false);
          fetchProduct();
        }}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        itemName={product.name}
      />
    </div>
  );
};

export default ProductDetail;
