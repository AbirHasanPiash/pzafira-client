import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import AddVariantModal from "./AddVariantModal";
import ImageUploadModal from "./ImageUploadModal";

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [productCreated, setProductCreated] = useState(false);
  const [productId, setProductId] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const fetchCategories = async () => {
    const cached = localStorage.getItem("categories");
    if (cached) {
      setCategories(JSON.parse(cached));
    }
    try {
      const res = await api.get("/products/api/categories/");
      setCategories(res.data.results);
      localStorage.setItem("categories", JSON.stringify(res.data.results));
    } catch (err) {
      toast.error("Failed to fetch categories");
    }
  };

  const fetchBrands = async () => {
    const cachedBrands = localStorage.getItem("brands");
    if (cachedBrands) {
      setBrands(JSON.parse(cachedBrands));
    }
    try {
      const res = await api.get("/products/api/brands/");
      setBrands(res.data.results);
      localStorage.setItem("brands", JSON.stringify(res.data.results));
    } catch (err) {
      toast.error("Failed to fetch brands");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !category || !brand || !targetAudience) {
      toast.error("All fields are required");
      return;
    }

    setSubmitting(true);

    const payload = {
      name,
      description,
      category: categories.find((c) => c.id === parseInt(category))?.name,
      brand: brands.find((b) => b.id === parseInt(brand))?.name,
      target_audience: targetAudience,
      is_active: isActive,
    };

    try {
      const res = await api.post("/products/api/products/", payload);
      setProductId(res.data.id);
      setProductCreated(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddImage = () => {
    setImageModalOpen(true);
  };

  const handleOpenVariantModal = () => {
    setShowVariantModal(true);
  };

  return (
    <div className="max-w-2xl mx-auto mb-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Create Product</h2>

      {!productCreated ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Fields */}
          <div>
            <label className="block mb-1 font-medium">Product Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Brand</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            >
              <option value="">Select a brand</option>
              {brands.map((br) => (
                <option key={br.id} value={br.id}>
                  {br.name}
                </option>
              ))}
            </select>
          </div>

          {/* Target Audience Field */}
          <div>
            <label className="block mb-1 font-medium">Target Customer</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              required
            >
              <option value="">Select Target Customer</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="mr-2"
            />
            <label className="font-medium">Is Active</label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`bg-black text-white px-4 py-2 rounded transition ${
              submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-black/80"
            }`}
          >
            {submitting ? "Creating..." : "Create Product"}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-green-600 font-medium">
            Product created successfully!
          </p>
          <div className="flex space-x-4">
            <button
              onClick={handleAddImage}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Add Images
            </button>
            <button
              onClick={handleOpenVariantModal}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              Add Variants
            </button>
          </div>
        </div>
      )}

      <AddVariantModal
        productId={productId}
        isOpen={showVariantModal}
        onClose={() => setShowVariantModal(false)}
      />
      {imageModalOpen && (
        <ImageUploadModal
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          productId={productId}
        />
      )}
    </div>
  );
};

export default CreateProduct;
