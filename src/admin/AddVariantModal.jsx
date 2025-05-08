import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

const AddVariantModal = ({ productId, isOpen, onClose, variant }) => {
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!variant;

  const resetForm = () => {
    setColor("");
    setSize("");
    setStock("");
    setPrice("");
  };

  useEffect(() => {
    if (isOpen) {
      fetchColors();
      fetchSizes();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && colors.length && sizes.length && variant) {
      const colorId =
        variant.color_id || colors.find((c) => c.name === variant.color)?.id;
      const sizeId =
        variant.size_id || sizes.find((s) => s.name === variant.size)?.id;

      setColor(colorId || "");
      setSize(sizeId || "");
      setStock(variant.stock.toString());
      setPrice(variant.price.toString());
    } else if (isOpen && !variant) {
      resetForm();
    }
  }, [isOpen, variant, colors, sizes]);

  const fetchColors = async () => {
    const cached = localStorage.getItem("colors");
    if (cached) setColors(JSON.parse(cached));

    try {
      const res = await api.get("/products/api/colors/");
      setColors(res.data.results);
      localStorage.setItem("colors", JSON.stringify(res.data.results));
    } catch {
      toast.error("Failed to fetch colors");
    }
  };

  const fetchSizes = async () => {
    const cached = localStorage.getItem("sizes");
    if (cached) setSizes(JSON.parse(cached));

    try {
      const res = await api.get("/products/api/sizes/");
      setSizes(res.data.results);
      localStorage.setItem("sizes", JSON.stringify(res.data.results));
    } catch {
      toast.error("Failed to fetch sizes");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!color || !size || !stock || !price) {
      toast.error("All fields are required");
      return;
    }

    const data = {
      color,
      size,
      stock: parseInt(stock),
      price: parseFloat(price),
    };

    setSubmitting(true);

    try {
      if (isEdit) {
        await api.patch(
          `/products/api/detail-products/${productId}/variants/${variant.id}/`,
          data
        );
        toast.success("Variant updated successfully!");
      } else {
        await api.post(
          `/products/api/detail-products/${productId}/variants/`,
          data
        );
        toast.success("Variant added successfully!");
      }
      onClose();
    } catch {
      toast.error(`Failed to ${isEdit ? "update" : "add"} variant`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Variant" : "Add Variant"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Color</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            >
              <option value="">Select Color</option>
              {colors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Size</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
            >
              <option value="">Select Size</option>
              {sizes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Stock</label>
            <input
              type="number"
              min="0"
              className="w-full border rounded px-3 py-2"
              value={stock}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || parseInt(value) >= 0) {
                  setStock(value);
                }
              }}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full border rounded px-3 py-2"
              value={price}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || parseFloat(value) >= 0) {
                  setPrice(value);
                }
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full bg-black text-white py-2 rounded ${
              submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-black/80"
            }`}
          >
            {submitting
              ? isEdit
                ? "Updating..."
                : "Adding..."
              : isEdit
              ? "Update Variant"
              : "Add Variant"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVariantModal;
