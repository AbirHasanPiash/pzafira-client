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

  const selectedAddress = addresses.find((addr) => addr.id === selectedId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 text-center"
      >
        {addresses.length === 0
          ? "You haven't saved any addresses yet."
          : "Your saved addresses"}
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <motion.div
            key={addr.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <AddressCard
              address={addr}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onEdit={(data) => {
                setEditing(data);
                setShowForm(true);
              }}
              onRequestDelete={(address) => setAddressToDelete(address)}
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        {showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AddressForm
              initialData={editing}
              onSubmit={handleAddOrUpdate}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
            />
          </motion.div>
        ) : (
          <div className="text-center">
            <button
              className="mt-4 px-6 py-2 bg-black hover:bg-black/80 text-white rounded-lg"
              onClick={() => {
                setShowForm(true);
                setEditing(null);
              }}
            >
              + Add New Address
            </button>
          </div>
        )}
      </div>

      {selectedAddress && (
        <div className="text-center mt-6">
          <Link
            to="/confirm-order"
            state={{ selectedAddress }}
            className="inline-block bg-black hover:bg-black/80 text-white px-6 py-2 rounded-lg transition"
          >
            Deliver to this address
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {addressToDelete && (
          <motion.div
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-xl text-center w-80"
            >
              <h3 className="text-lg font-semibold mb-4">Delete Address</h3>
              <p className="text-gray-600 mb-6 text-sm">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddressPage;
