// src/shop/Filter.jsx
import { useState, useEffect, useMemo, useRef } from "react";

/**
 * Robust Filter component to avoid render loops / jitter:
 * - Syncs appliedFilters -> local state only when content actually changes
 * - Emits local -> parent only when computed filters differ from last emitted
 * - Uses an isSyncing guard so a sync does not cause an immediate re-emit
 */

const Filter = ({ onFilterChange, options = {}, appliedFilters = {} }) => {
  // numeric defaults
  const optMin = Number(options.minPrice ?? 0);
  const optMax = Number(options.maxPrice ?? 20000);

  // local UI state (initialized from appliedFilters/options)
  const [selectedCategory, setSelectedCategory] = useState(
    appliedFilters.category ?? null
  );
  const [selectedBrand, setSelectedBrand] = useState(
    appliedFilters.brand ?? null
  );
  const [priceRange, setPriceRange] = useState([
    Number(appliedFilters.minPrice ?? optMin),
    Number(appliedFilters.maxPrice ?? optMax),
  ]);

  // refs to avoid loops
  const isSyncingRef = useRef(false); // true while we apply incoming appliedFilters -> local
  const lastEmittedRef = useRef(JSON.stringify(appliedFilters ?? {})); // last filters we sent to parent

  // helper: compute minimal filter object from local state
  const computeLocalFilters = () => {
    const f = {};
    if (selectedCategory) f.category = selectedCategory;
    if (selectedBrand) f.brand = selectedBrand;

    if (Number(priceRange[0]) !== optMin) f.minPrice = Number(priceRange[0]);
    if (Number(priceRange[1]) !== optMax) f.maxPrice = Number(priceRange[1]);

    return f;
  };

  // memoized local filters and their JSON representation
  const localFiltersObj = useMemo(computeLocalFilters, [
    selectedCategory,
    selectedBrand,
    priceRange,
    optMin,
    optMax,
  ]);
  const localFiltersJSON = useMemo(() => JSON.stringify(localFiltersObj), [
    localFiltersObj,
  ]);
  const appliedFiltersJSON = useMemo(
    () => JSON.stringify(appliedFilters ?? {}),
    [appliedFilters]
  );

  // 1) Sync appliedFilters -> local UI *only when content differs*
  useEffect(() => {
    if (appliedFiltersJSON === lastEmittedRef.current && appliedFiltersJSON === localFiltersJSON) {
      // nothing changed; keep local state
      return;
    }

    // parse applied
    const applied = appliedFilters ?? {};

    // derive new values from appliedFilters (or fallback to options)
    const newCat = applied.category ?? null;
    const newBrand = applied.brand ?? null;
    const newMin = Number(applied.minPrice ?? optMin);
    const newMax = Number(applied.maxPrice ?? optMax);

    // quick equality check: if local already matches derived, nothing to set
    if (
      newCat === selectedCategory &&
      newBrand === selectedBrand &&
      Number(priceRange[0]) === newMin &&
      Number(priceRange[1]) === newMax
    ) {
      return;
    }

    // mark syncing so the emit-effect won't re-emit
    isSyncingRef.current = true;

    // update local UI to reflect appliedFilters
    setSelectedCategory(newCat);
    setSelectedBrand(newBrand);
    setPriceRange([newMin, newMax]);

    // clear syncing on next microtask so user interactions still emit normally
    // (using setTimeout 0 to let state update settle)
    setTimeout(() => {
      isSyncingRef.current = false;
      // also update lastEmittedRef to reflect parent-applied (prevents immediate re-emit)
      lastEmittedRef.current = appliedFiltersJSON;
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFiltersJSON, optMin, optMax]);

  // 2) Emit local -> parent only when local differs from lastEmitted and not currently syncing
  useEffect(() => {
    if (isSyncingRef.current) return; // don't emit while syncing
    if (localFiltersJSON === lastEmittedRef.current) return; // no change vs last emitted

    // emit and remember what we emitted
    onFilterChange(localFiltersObj);
    lastEmittedRef.current = localFiltersJSON;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localFiltersJSON, onFilterChange]);

  // Reset handler
  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setPriceRange([optMin, optMax]);
  };

  return (
    <div className="space-y-8">
      {/* Category */}
      {options.categories && options.categories.length > 0 && (
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
            {options.categories.map((cat) => (
              <div key={cat}>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="category"
                    className="form-radio text-black"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                  />
                  <span className="ml-2 text-sm">{cat}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brand */}
      {options.brands && options.brands.length > 0 && (
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
            {options.brands.map((brand) => (
              <div key={brand}>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="brand"
                    className="form-radio text-black"
                    checked={selectedBrand === brand}
                    onChange={() => setSelectedBrand(brand)}
                  />
                  <span className="ml-2 text-sm">{brand}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      {options.minPrice !== undefined && options.maxPrice !== undefined && (
        <div>
          <h3 className="font-semibold mb-2 text-lg">Price Range</h3>

          <div className="flex items-center space-x-2">
            <span className="text-md">
              <span className="text-xl">৳</span>
              {priceRange[0]}
            </span>
            <input
              type="range"
              min={options.minPrice ?? optMin}
              max={options.maxPrice ?? optMax}
              step="50"
              value={priceRange[0]}
              onChange={(e) => {
                const val = Number(e.target.value);
                const newMin = Math.min(val, priceRange[1]);
                setPriceRange([newMin, priceRange[1]]);
              }}
              className="w-full accent-black"
            />
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <span className="text-md">
              <span className="text-xl">৳</span>
              {priceRange[1]}
            </span>
            <input
              type="range"
              min={options.minPrice ?? optMin}
              max={options.maxPrice ?? optMax}
              step="50"
              value={priceRange[1]}
              onChange={(e) => {
                const val = Number(e.target.value);
                const newMax = Math.max(val, priceRange[0]);
                setPriceRange([priceRange[0], newMax]);
              }}
              className="w-full accent-black"
            />
          </div>
        </div>
      )}

      {/* Reset Button */}
      <div className="mt-6">
        <button
          onClick={handleReset}
          className="w-full bg-gray-100 text-black py-2 rounded-md font-medium hover:bg-gray-200 transition"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};

export default Filter;
