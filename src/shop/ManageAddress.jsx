import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import { toast } from "react-toastify";

const ManageAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // 🔁 Fetch all addresses
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/shipping/api/addresses/");
      setAddresses(res.data.results || []);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      toast.error("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add or update address
  const handleAddOrUpdate = async (formData) => {
    try {
      if (editing) {
        await api.put(`/shipping/api/addresses/${editing.id}/`, formData);
        toast.success("Address updated successfully!");
      } else {
        await api.post("/shipping/api/addresses/", formData);
        toast.success("Address added successfully!");
      }
      setShowForm(false);
      setEditing(null);
      fetchAddresses();
    } catch (err) {
      console.error("Error saving address:", err);
      toast.error("Could not save address");
    }
  };

  // 🗑️ Confirm delete
  const confirmDelete = async () => {
    if (!addressToDelete) return;
    setConfirmingDelete(true);
    try {
      await api.delete(`/shipping/api/addresses/${addressToDelete.id}/`);
      toast.success("Address deleted successfully!");
      setAddressToDelete(null);
      fetchAddresses();
    } catch (err) {
      console.error("Error deleting address:", err);
      toast.error("Failed to delete address");
    } finally {
      setConfirmingDelete(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="container max-w-7xl mx-auto px-6 sm:px-10 md:px-16 py-8">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 text-center"
      >
        Manage Your Addresses
      </motion.h2>

      {/* 🌀 Loader */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-full h-40 bg-gray-100 animate-pulse rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      <AnimatePresence>
        {!loading && addresses.length === 0 && !showForm && (
          <motion.div
            className="text-center text-gray-500 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-lg font-medium">You haven&apos;t saved any address yet.</p>
            <p className="text-sm mt-2">Click below to add your first address.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved addresses */}
      {!loading && addresses.length > 0 && (
        <>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-semibold mb-4"
          >
            Your saved addresses
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((addr) => (
              <motion.div
                key={addr.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                <AddressCard
                  address={addr}
                  onEdit={() => {
                    setEditing(addr);
                    setShowForm(true);
                  }}
                  onRequestDelete={() => setAddressToDelete(addr)}
                />
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Add or Edit Form */}
      <div className="mt-8 text-center">
        {!showForm ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-black hover:bg-black/80 text-white rounded-lg"
            onClick={() => {
              setShowForm(true);
              setEditing(null);
            }}
          >
            + Add New Address
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
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
        )}
      </div>

      {/* 🗑️ Delete Confirmation Modal */}
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
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
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

export default ManageAddress;
