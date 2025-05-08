import React from "react";

const VariantList = ({ variants, handleAddVariant, handleVariantChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2">Variants</h3>
      {variants.map((variant, idx) => (
        <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
          <input
            placeholder="Color ID"
            value={variant.color}
            onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
            className="input"
          />
          <input
            placeholder="Size ID"
            value={variant.size}
            onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
            className="input"
          />
          <input
            placeholder="Stock"
            type="number"
            value={variant.stock}
            onChange={(e) => handleVariantChange(idx, "stock", e.target.value)}
            className="input"
          />
          <input
            placeholder="Price"
            type="text"
            value={variant.price}
            onChange={(e) => handleVariantChange(idx, "price", e.target.value)}
            className="input"
          />
        </div>
      ))}
      <button onClick={handleAddVariant} className="btn btn-outline">
        + Add Variant
      </button>
    </div>
  );
};

export default VariantList;