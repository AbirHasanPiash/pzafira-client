import { useEffect, useState } from "react";
import api from "../api/axios";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";
import ModalForm from "./ModalForm";

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [form, setForm] = useState({ name: "", logo: null });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  const fetchBrands = async () => {
    const cachedBrands = localStorage.getItem("brands");
    if (cachedBrands) {
      setBrands(JSON.parse(cachedBrands));
      setLoading(false);
    }
    try {
      const res = await api.get("/products/api/brands/");
      setBrands(res.data.results);
      localStorage.setItem("brands", JSON.stringify(res.data.results));
    } catch (err) {
      toast.error("Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    const formData = new FormData();
    formData.append("name", form.name);
    if (form.logo) formData.append("logo", form.logo);

    try {
      if (editingBrand) {
        await api.put(`/products/api/brands/${editingBrand.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Brand updated");
      } else {
        await api.post("/products/api/brands/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Brand created");
      }

      fetchBrands();
      setShowModal(false);
      setForm({ name: "", logo: null });
      setEditingBrand(null);
    } catch (err) {
      toast.error("Operation failed");
      console.error(err.response?.data || err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setForm({ name: brand.name, logo: null });
    setShowModal(true);
  };

  const confirmDelete = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const handleDelete = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ show: false, id: null });
    try {
      await api.delete(`/products/api/brands/${id}/`);
      toast.success("Brand deleted");
      fetchBrands();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const brandFields = [
    { name: "name", label: "Brand Name", type: "text", required: true },
    { name: "logo", label: "Logo (optional)", type: "file", required: false, accept: "image/*" },
  ];

  return (
    <div className="pl-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Brands</h1>
        <button
          onClick={() => {
            setForm({ name: "", logo: null });
            setEditingBrand(null);
            setShowModal(true);
          }}
          className="bg-black text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} /> Add Brand
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{brand.name}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(brand)} className="text-blue-600">
                  <Pencil size={18} />
                </button>
                <button onClick={() => confirmDelete(brand.id)} className="text-red-600">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Reusable Form Modal */}
      <ModalForm
        show={showModal}
        title={editingBrand ? "Edit Brand" : "Add Brand"}
        fields={brandFields}
        values={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={() => {
          setShowModal(false);
          setForm({ name: "", logo: null });
          setEditingBrand(null);
        }}
        loading={submitLoading}
        submitText={editingBrand ? "Update Brand" : "Create Brand"}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        show={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, id: null })}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this brand? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmClass="bg-red-600 hover:bg-red-700 text-white"
      />
    </div>
  );
};

export default Brand;
