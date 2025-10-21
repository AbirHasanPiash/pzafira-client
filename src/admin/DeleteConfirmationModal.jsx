import { useState } from "react";
import { toast } from "react-toastify";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName = "item" }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    toast.info("Demo mode: This action is disabled.");
    onClose();
    return;

    // setIsDeleting(true);
    // await onConfirm(); // Run the parent deletion logic
    // setIsDeleting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Delete {itemName}?</h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this {itemName}? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
