import React, { useState, useEffect } from "react";

const AddressForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postal_code: "",
    country: "",
    is_default: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="p-4 border rounded mb-4" onSubmit={handleSubmit}>
      <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
      <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
      <input type="text" name="postal_code" placeholder="Postal Code" value={formData.postal_code} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
      <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
      <label className="flex items-center gap-2 mb-2">
        <input type="checkbox" name="is_default" checked={formData.is_default} onChange={handleChange} />
        Save as default
      </label>
      <div className="flex gap-2">
        <button type="submit" className="bg-black hover:bg-black/80 text-white px-4 py-2 rounded">Save</button>
        {onCancel && <button type="button" onClick={onCancel} className="text-gray-600">Cancel</button>}
      </div>
    </form>
  );
};

export default AddressForm;
