import { useEffect, useState } from "react";
import api from "../api/axios";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";
import ModalForm from "./ModalForm";

const Size = () => {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSize, setEditingSize] = useState(null);
  const [form, setForm] = useState({ name: "" });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  const fetchSizes = async () => {
    const cached = localStorage.getItem("sizes");
    if (cached) {
      setSizes(JSON.parse(cached));
      setLoading(false);
    }
    try {
      const res = await api.get("/products/api/sizes/");
      setSizes(res.data.results);
      localStorage.setItem("sizes", JSON.stringify(res.data.results));
    } catch (err) {
      toast.error("Failed to fetch sizes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
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
      if (editingSize) {
        await api.put(`/products/api/sizes/${editingSize.id}/`, form);
        toast.success("Size updated");
      } else {
        await api.post("/products/api/sizes/", form);
        toast.success("Size created");
      }

      fetchSizes();
      setShowModal(false);
      setForm({ name: "" });
      setEditingSize(null);
    } catch (err) {
      toast.error("Operation failed");
      console.error(err.response?.data || err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (size) => {
    setEditingSize(size);
    setForm({ name: size.name });
    setShowModal(true);
  };

  const confirmDelete = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const handleDelete = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ show: false, id: null });
    try {
      await api.delete(`/products/api/sizes/${id}/`);
      toast.success("Size deleted");
      fetchSizes();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const sizeFields = [
    { name: "name", label: "Size Name", type: "text", required: true },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sizes</h1>
        <button
          onClick={() => {
            setForm({ name: "" });
            setEditingSize(null);
            setShowModal(true);
          }}
          className="bg-black text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} /> Add Size
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sizes.map((size) => (
            <div
              key={size.id}
              className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{size.name}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(size)} className="text-blue-600">
                  <Pencil size={18} />
                </button>
                <button onClick={() => confirmDelete(size.id)} className="text-red-600">
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
        title={editingSize ? "Edit Size" : "Add Size"}
        fields={sizeFields}
        values={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={() => {
          setShowModal(false);
          setForm({ name: "" });
          setEditingSize(null);
        }}
        loading={submitLoading}
        submitText={editingSize ? "Update Size" : "Create Size"}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        show={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, id: null })}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this size? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmClass="bg-red-600 hover:bg-red-700 text-white"
      />
    </div>
  );
};

export default Size;
