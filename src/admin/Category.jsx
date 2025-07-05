import { useEffect, useState } from "react";
import api from "../api/axios";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";
import ModalForm from "./ModalForm";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: "" });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  const fetchCategories = async () => {
    const cached = localStorage.getItem("categories");
    if (cached) {
      setCategories(JSON.parse(cached));
      setLoading(false);
    }
    try {
      const res = await api.get("/products/api/categories/");
      setCategories(res.data.results);
      localStorage.setItem("categories", JSON.stringify(res.data.results));
    } catch (err) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      if (editingCategory) {
        await api.put(`/products/api/categories/${editingCategory.id}/`, form);
        toast.success("Category updated");
      } else {
        await api.post("/products/api/categories/", form);
        toast.success("Category created");
      }

      fetchCategories();
      setShowModal(false);
      setForm({ name: "" });
      setEditingCategory(null);
    } catch (err) {
      toast.error("Operation failed");
      console.error(err.response?.data || err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setForm({ name: category.name });
    setShowModal(true);
  };

  const confirmDelete = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const handleDelete = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ show: false, id: null });
    try {
      await api.delete(`/products/api/categories/${id}/`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const categoryFields = [
    { name: "name", label: "Category Name", type: "text", required: true },
  ];

  return (
    <div className="pl-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={() => {
            setForm({ name: "" });
            setEditingCategory(null);
            setShowModal(true);
          }}
          className="bg-black text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{category.name}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(category)} className="text-blue-600">
                  <Pencil size={18} />
                </button>
                <button onClick={() => confirmDelete(category.id)} className="text-red-600">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reusable Form Modal */}
      <ModalForm
        show={showModal}
        title={editingCategory ? "Edit Category" : "Add Category"}
        fields={categoryFields}
        values={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={() => {
          setShowModal(false);
          setForm({ name: "" });
          setEditingCategory(null);
        }}
        loading={submitLoading}
        submitText={editingCategory ? "Update Category" : "Create Category"}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        show={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, id: null })}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmClass="bg-red-600 hover:bg-red-700 text-white"
      />
    </div>
  );
};

export default Category;
