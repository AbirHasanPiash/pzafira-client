import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

const ImageUploadModal = ({ isOpen, onClose, productId }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [progress, setProgress] = useState({});
  const [isPrimary, setIsPrimary] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
    setProgress({});
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }
  
    setUploading(true);
    const newProgress = {};
  
    const uploadTasks = selectedFiles.map((file, i) => {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("is_primary", isPrimary && i === 0);
  
      return api.post(
        `/products/api/detail-products/${productId}/images/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            newProgress[i] = percent;
            setProgress({ ...newProgress });
          },
        }
      ).then(() => ({ index: i, success: true }))
       .catch((err) => ({ index: i, success: false, error: err }));
    });
  
    const results = await Promise.allSettled(uploadTasks);
  
    const failed = [];
    results.forEach((res, i) => {
      if (res.status === "fulfilled" && res.value.success) {
        toast.success(`Image ${i + 1} uploaded successfully`);
      } else {
        failed.push(i + 1);
        toast.error(`Image ${i + 1} failed to upload`);
      }
    });
  
    if (failed.length === 0) {
      onClose();
    } else {
      toast.warn(`Some images failed (Image ${failed.join(", ")}). Try again.`);
    }
  
    setUploading(false);
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg md:max-w-xl lg:max-w-2xl p-6 shadow-lg overflow-y-auto max-h-[90vh]">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Upload Product Images</h3>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="w-full border rounded p-2 text-sm"
        />

        {previewUrls.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="flex flex-col items-center w-24">
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  className="w-24 h-24 object-cover rounded border"
                />
                {uploading && (
                  <div className="w-full bg-gray-200 rounded-full mt-2 h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${progress[index] || 0}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <label className="flex items-center mt-4 text-sm">
          <input
            type="checkbox"
            checked={isPrimary}
            onChange={(e) => setIsPrimary(e.target.checked)}
            className="mr-2"
          />
          Set first image as Primary
        </label>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
