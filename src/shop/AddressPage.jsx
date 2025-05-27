import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import { Link } from "react-router-dom";


const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [addressToDelete, setAddressToDelete] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/shipping/api/addresses/");
      setAddresses(res.data.results);
    } catch (err) {
      console.error("Error fetching addresses", err);
    }
  };

  const handleAddOrUpdate = async (formData) => {
    try {
      if (editing) {
        await api.put(`/shipping/api/addresses/${editing.id}/`, formData);
      } else {
        await api.post("/shipping/api/addresses/", formData);
      }
      setShowForm(false);
      setEditing(null);
      fetchAddresses();
    } catch (err) {
      console.error("Error saving address", err);
    }
  };

  const confirmDelete = async () => {
    if (!addressToDelete) return;
    setConfirmingDelete(true);
    try {
      await api.delete(`/shipping/api/addresses/${addressToDelete.id}/`);
      setAddressToDelete(null);
      fetchAddresses();
    } catch (err) {
      console.error("Error deleting address", err);
    } finally {
      setConfirmingDelete(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Saved Addresses</h2>

      {addresses.map((addr) => (
        <AddressCard
          key={addr.id}
          address={addr}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onEdit={(data) => {
            setEditing(data);
            setShowForm(true);
          }}
          onRequestDelete={(address) => setAddressToDelete(address)}
        />
      ))}

      {showForm ? (
        <AddressForm
          initialData={editing}
          onSubmit={handleAddOrUpdate}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      ) : (
        <button
          className="my-4 px-4 py-2 bg-black hover:bg-black/80 text-white rounded"
          onClick={() => {
            setShowForm(true);
            setEditing(null);
          }}
        >
          + Add New Address
        </button>
      )}

      {selectedId && (
        <div className="mb-6">
          <Link to="/confirm-order"
            state={{ selectedAddress: addresses.find(addr => addr.id === selectedId) }}
            className="bg-black hover:bg-black/80 text-white px-4 py-2 rounded">
            Deliver to this address
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {addressToDelete && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-lg text-center w-80"
            >
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p className="text-gray-600 mb-6 text-sm md:text-base">
                Are you sure you want to delete this address?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmDelete}
                  disabled={confirmingDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  {confirmingDelete ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  onClick={() => setAddressToDelete(null)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddressPage;
