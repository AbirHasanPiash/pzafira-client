import { useEffect, useState } from "react";
import api from "../api/axios";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";
import ModalForm from "./ModalForm";

const Color = () => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  const [form, setForm] = useState({ name: "" });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  const fetchColors = async () => {
    const cached = localStorage.getItem("colors");
    if (cached) {
      setColors(JSON.parse(cached));
      setLoading(false);
    }
    try {
      const res = await api.get("/products/api/colors/");
      setColors(res.data.results);
      localStorage.setItem("colors", JSON.stringify(res.data.results));
    } catch (err) {
      toast.error("Failed to fetch colors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
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
      if (editingColor) {
        toast.info("Demo mode: This action is disabled.");
        // await api.put(`/products/api/colors/${editingColor.id}/`, form);
        // toast.success("Color updated");
      } else {
        await api.post("/products/api/colors/", form);
        toast.success("Color created");
      }

      fetchColors();
      setShowModal(false);
      setForm({ name: "" });
      setEditingColor(null);
    } catch (err) {
      toast.error("Operation failed");
      console.error(err.response?.data || err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (color) => {
    setEditingColor(color);
    setForm({ name: color.name });
    setShowModal(true);
  };

  const confirmDelete = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const handleDelete = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ show: false, id: null });
    try {
      await api.delete(`/products/api/colors/${id}/`);
      toast.success("Color deleted");
      fetchColors();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const colorFields = [
    { name: "name", label: "Color Name", type: "text", required: true },
  ];

  return (
    <div className="pl-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Colors</h1>
        <button
          onClick={() => {
            setForm({ name: "" });
            setEditingColor(null);
            setShowModal(true);
          }}
          className="bg-black text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} /> Add Color
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {colors.map((color) => (
            <div
              key={color.id}
              className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{color.name}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(color)} className="text-blue-600">
                  <Pencil size={18} />
                </button>
                <button onClick={() => confirmDelete(color.id)} className="text-red-600">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <ModalForm
        show={showModal}
        title={editingColor ? "Edit Color" : "Add Color"}
        fields={colorFields}
        values={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={() => {
          setShowModal(false);
          setForm({ name: "" });
          setEditingColor(null);
        }}
        loading={submitLoading}
        submitText={editingColor ? "Update Color" : "Create Color"}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        show={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, id: null })}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this color? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmClass="bg-red-600 hover:bg-red-700 text-white"
      />
    </div>
  );
};

export default Color;
