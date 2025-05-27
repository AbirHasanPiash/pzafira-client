import React from "react";

const AddressCard = ({ address, selectedId, onSelect, onEdit, onRequestDelete }) => {
  const {
    id, address: addr, city, postal_code, country, is_default,
  } = address;

  return (
    <div className={`border p-4 rounded mb-3 ${selectedId === id ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}>
      <div onClick={() => onSelect(id)} className="cursor-pointer">
        <p><strong>{addr}</strong></p>
        <p>{city}, {postal_code}, {country}</p>
        {is_default && <span className="text-green-600 text-sm">Default</span>}
      </div>
      <div className="flex gap-2 mt-2">
        <button className="text-blue-500" onClick={() => onEdit(address)}>Edit</button>
        <button className="text-red-500" onClick={() => onRequestDelete(address)}>Delete</button>
      </div>
    </div>
  );
};

export default AddressCard;
