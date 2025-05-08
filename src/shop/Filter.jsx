import { useState, useEffect } from "react";
import api from "../api/axios";

const Filter = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 5000]);

  // Fetch filter options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, brandRes, sizeRes, colorRes] = await Promise.all([
          api.get("/products/api/categories/"),
          api.get("/products/api/brands/"),
          api.get("/products/api/sizes/"),
          api.get("/products/api/colors/"),
        ]);
        setCategories(catRes.data.results);
        setBrands(brandRes.data.results);
        setSizes(sizeRes.data.results);
        setColors(colorRes.data.results);
      } catch (error) {
        console.error("Failed to load filter options:", error);
      }
    };

    fetchOptions();
  }, []);

  // Update filters whenever user selects something
  useEffect(() => {
    const newFilters = {};

    if (selectedCategory) newFilters.category = selectedCategory;
    if (selectedBrand) newFilters.brand = selectedBrand;
    if (selectedSize) newFilters["variants__size"] = selectedSize;
    if (selectedColor) newFilters["variants__color"] = selectedColor;
    if (priceRange[0] > 0) newFilters.min_price = priceRange[0];
    if (priceRange[1] < 5000) newFilters.max_price = priceRange[1];

    onFilterChange(newFilters);
  }, [selectedCategory, selectedBrand, selectedSize, selectedColor, priceRange, onFilterChange]);

  return (
    <div className="space-y-8">
      {/* Category */}
      <div>
        <h3 className="font-semibold mb-3 text-lg text-gray-800">Category</h3>
        <div className="space-y-2">
          <div>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="category"
                className="form-radio text-black"
                checked={selectedCategory === null}
                onChange={() => setSelectedCategory(null)}
              />
              <span className="ml-2 text-sm">None</span>
            </label>
          </div>
          {categories.map((cat) => (
            <div key={cat.id}>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="category"
                  className="form-radio text-black"
                  checked={selectedCategory === cat.id}
                  onChange={() => setSelectedCategory(cat.id)}
                />
                <span className="ml-2 text-sm">{cat.name}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h3 className="font-semibold mb-3 text-lg text-gray-800">Brand</h3>
        <div className="space-y-2">
          <div>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="brand"
                className="form-radio text-black"
                checked={selectedBrand === null}
                onChange={() => setSelectedBrand(null)}
              />
              <span className="ml-2 text-sm">None</span>
            </label>
          </div>
          {brands.map((brand) => (
            <div key={brand.id}>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="brand"
                  className="form-radio text-black"
                  checked={selectedBrand === brand.id}
                  onChange={() => setSelectedBrand(brand.id)}
                />
                <span className="ml-2 text-sm">{brand.name}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <h3 className="font-semibold mb-3 text-lg text-gray-800">Size</h3>
        <div className="flex flex-wrap gap-3">
          {sizes.map((size) => (
            <button
              key={size.id}
              type="button"
              className={`border px-3 py-1 rounded-full hover:scale-103 duration-300 text-sm ${selectedSize === size.id ? "bg-black text-white" : "bg-white"}`}
              onClick={() => setSelectedSize(selectedSize === size.id ? null : size.id)}
            >
              {size.name}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h3 className="font-semibold mb-3 text-lg text-gray-800">Color</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color.id}
              type="button"
              className={`border px-3 py-1 rounded-full hover:scale-103 duration-300 text-sm ${selectedColor === color.id ? "bg-black text-white" : "bg-white"}`}
              onClick={() => setSelectedColor(selectedColor === color.id ? null : color.id)}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-2 text-lg">Price Range</h3>
        <div className="flex items-center space-x-2">
          <span className="text-md"><span className="text-xl">৳</span>{priceRange[0]}</span>
          <input
            type="range"
            min="0"
            max="20000"
            step="50"
            value={priceRange[0]}
            onChange={(e) => {
              const newMin = Math.min(+e.target.value, priceRange[1]);
              setPriceRange([newMin, priceRange[1]]);
            }}
            className="w-full accent-black"
          />
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-md"><span className="text-xl">৳</span>{priceRange[1]}</span>
          <input
            type="range"
            min="0"
            max="20000"
            step="50"
            value={priceRange[1]}
            onChange={(e) => {
              const newMax = Math.max(+e.target.value, priceRange[0]);
              setPriceRange([priceRange[0], newMax]);
            }}
            className="w-full accent-black"
          />
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-6">
        <button
          onClick={() => {
            setSelectedCategory(null);
            setSelectedBrand(null);
            setSelectedSize(null);
            setSelectedColor(null);
            setPriceRange([0, 5000]);
          }}
          className="w-full bg-gray-100 text-black py-2 rounded-md font-medium hover:bg-gray-200 transition"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};

export default Filter;
