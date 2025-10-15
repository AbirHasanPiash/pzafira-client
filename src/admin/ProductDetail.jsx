import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import api from "../api/axios";
import { Pencil, Trash, Plus, X, Save } from "lucide-react";
import { toast } from "react-toastify";
import AddVariantModal from "./AddVariantModal";
import ImageUploadModal from "./ImageUploadModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const fetcher = async (url) => {
  const res = await api.get(url);
  return res.data;
};

const ProductDetail = () => {
  const { id } = useParams();

  // Auto-scroll to top when component loads or product ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const { data: product, error, mutate } = useSWR(
    `/products/api/detail-products/${id}/`,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: true,
    }
  );

  const [isVariantModalOpen, setVariantModalOpen] = useState(false);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  // Initialize editable data when edit starts
  const handleStartEdit = () => {
    setEditData({
      name: product.name,
      target_audience: product.target_audience,
      description: product.description,
      brand: product.brand,
      category: product.category,
      is_active: product.is_active,
    });
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData(null);
  };

  console.log("Updating product with data:", editData);


  // Submit updated basic info
  const handleSaveEdit = async () => {
    try {
      await api.put(`/products/api/products/${id}/`, editData);
      toast.success("Product info updated successfully!");
      setIsEditing(false);
      mutate(); // Refresh product info
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product info.");
    }
  };

  // Delete variant
  const handleDeleteVariant = async (variantId) => {
    try {
      await api.delete(
        `/products/api/detail-products/${id}/variants/${variantId}/`
      );
      toast.success("Variant deleted successfully");
      mutate();
    } catch (err) {
      toast.error("Failed to delete variant");
    }
  };

  // Delete image
  const handleDeleteImage = async (imageId) => {
    try {
      await api.delete(`/products/api/detail-products/${id}/images/${imageId}/`);
      toast.success("Image deleted successfully");
      mutate();
    } catch (err) {
      toast.error("Failed to delete image");
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    try {
      await api.delete(`/products/api/detail-products/${id}/`);
      toast.success("Product deleted successfully");
      setDeleteModalOpen(false);
      window.location.href = "/admin/products";
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  if (error)
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load product.
      </div>
    );

  if (!product) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Basic Info */}
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
        {!isEditing ? (
          <button
            onClick={handleStartEdit}
            className="flex items-center gap-1 bg-black hover:bg-black/80 text-white px-3 py-2 rounded text-sm"
          >
            <Pencil className="w-4 h-4" /> Edit Basic Info
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
            >
              <Save className="w-4 h-4" /> Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex items-center gap-1 bg-gray-300 hover:bg-gray-400 px-3 py-2 rounded text-sm"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <>
          <p className="mb-2 text-gray-700 text-sm sm:text-base">
            {product.description}
          </p>
          <p className="mb-1 text-sm">
            <strong>Target:</strong> {product.target_audience}
          </p>
          <p className="mb-1 text-sm">
            <strong>Brand:</strong> {product.brand}
          </p>
          <p className="mb-4 text-sm">
            <strong>Category:</strong> {product.category}
          </p>
          <p className="mb-4 text-sm">
            <strong>Status:</strong>{" "}
            {product.is_active ? "Active ✅" : "Inactive ❌"}
          </p>
        </>
      ) : (
        <div className="bg-gray-50 border rounded-md p-4 mb-4">
          <div className="grid gap-3">
            <input
              type="text"
              className="border p-2 rounded text-sm w-full"
              placeholder="Product Name"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />

            <textarea
              className="border p-2 rounded text-sm w-full"
              placeholder="Description"
              rows="3"
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
            />

            <select
              className="border p-2 rounded text-sm"
              value={editData.target_audience}
              onChange={(e) =>
                setEditData({ ...editData, target_audience: e.target.value })
              }
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>

            <input
              type="text"
              className="border p-2 rounded text-sm w-full"
              placeholder="Brand"
              value={editData.brand}
              onChange={(e) =>
                setEditData({ ...editData, brand: e.target.value })
              }
            />

            <input
              type="text"
              className="border p-2 rounded text-sm w-full"
              placeholder="Category"
              value={editData.category}
              onChange={(e) =>
                setEditData({ ...editData, category: e.target.value })
              }
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editData.is_active}
                onChange={(e) =>
                  setEditData({ ...editData, is_active: e.target.checked })
                }
              />
              Active Product
            </label>
          </div>
        </div>
      )}

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
        {product.variants?.map((v) => (
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
                  setEditingVariant(v);
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
            setEditingVariant(null);
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

      {/* Modals */}
      <AddVariantModal
        productId={id}
        isOpen={isVariantModalOpen}
        onClose={() => {
          setVariantModalOpen(false);
          setEditingVariant(null);
          mutate();
        }}
        variant={editingVariant}
      />

      <ImageUploadModal
        productId={id}
        isOpen={isImageModalOpen}
        onClose={() => {
          setImageModalOpen(false);
          mutate();
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
