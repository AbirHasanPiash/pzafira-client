import { X } from "lucide-react";
import { toast } from "react-toastify";

const ConfirmModal = ({
  show,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmClass = "bg-red-600 hover:bg-red-700 text-white",
}) => {
  if (!show) return null;

  const handleConfirm = async () => {
    // Protection Mode (demo only)
    toast.info("Demo mode: This action is disabled.");
    onClose();
    return;

    // Actual action
    
    // await onConfirm();
    
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X size={22} />
        </button>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded ${confirmClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
