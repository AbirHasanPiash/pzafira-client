import { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import api from "../api/axios";
import { uniqBy } from "lodash";
import ProductCard from "./ProductCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Filter from "./Filter";

const Shop = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const shouldScrollRef = useRef(false);

  const fetchProducts = async (url = null, shouldScroll = true) => {
    setLoading(true);
    try {
      const query = url ? "" : new URLSearchParams(filters).toString();
      const endpoint = url || `/products/api/detail-products/?${query}`;
      const response = await api.get(endpoint);

      const uniqueProducts = uniqBy(response.data.results, "id");
      setProducts(uniqueProducts);

      setNextPageUrl(response.data.next);
      setPrevPageUrl(response.data.previous);

      const cacheData = {
        timestamp: Date.now(),
        filters,
        data: uniqueProducts,
        nextPageUrl: response.data.next,
        prevPageUrl: response.data.previous,
        currentPageUrl: url,
      };
      localStorage.setItem("cachedProducts", JSON.stringify(cacheData));

      if (shouldScroll) {
        shouldScrollRef.current = true;
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (shouldScrollRef.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      shouldScrollRef.current = false;
    }
  }, [products]);

  useEffect(() => {
    const cached = localStorage.getItem("cachedProducts");

    if (cached) {
      const {
        timestamp,
        filters: cachedFilters,
        data,
        nextPageUrl: cachedNext,
        prevPageUrl: cachedPrev,
        currentPageUrl,
      } = JSON.parse(cached);

      const fiveMinutes = 5 * 60 * 1000;
      const isSameFilter =
        JSON.stringify(cachedFilters) === JSON.stringify(filters);
      const isFresh = Date.now() - timestamp < fiveMinutes;

      if (isSameFilter && isFresh) {
        setProducts(data);
        setNextPageUrl(cachedNext || null);
        setPrevPageUrl(cachedPrev || null);
        setLoading(false);

        fetchProducts(currentPageUrl, false);
        return;
      }
    }

    fetchProducts();
  }, [filters]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const performSearch = () => {
    const searchTerm = filters.search?.trim().toLowerCase();
    if (!searchTerm) return;

    const cached = localStorage.getItem("cachedProducts");
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      const fiveMinutes = 5 * 60 * 1000;
      const isFresh = Date.now() - timestamp < fiveMinutes;

      if (isFresh) {
        const filtered = data.filter((p) =>
          p.name?.toLowerCase().includes(searchTerm)
        );
        if (filtered.length > 0) {
          setProducts(filtered);
          setNextPageUrl(null);
          setPrevPageUrl(null);
          return;
        }
      }
    }

    fetchProducts();
  };

  const handleCloseFilter = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsFilterOpen(false);
      setIsClosing(false);
    }, 400); // Same as your animation duration
  };

  return (
    <div className="p-4 pb-16 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between lg:justify-center gap-4 mb-6">
        <button
          className="lg:hidden text-sm font-semibold bg-black text-white rounded-md px-4 py-2 w-full sm:w-auto"
          onClick={() => setIsFilterOpen(true)}
        >
          Filters
        </button>

        {/* Search Bar */}
        <div className="relative w-full sm:w-96 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search || ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") performSearch();
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
          />
          <button
            onClick={performSearch}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-60 bg-white rounded-lg p-5 shadow-md">
          <div className="flex justify-center items-center">
            <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
          </div>
          <Filter onFilterChange={handleFilterChange} />
        </aside>

        {/* Product Grid */}
        <section className="flex-1">
          {loading ? (
            <div className="min-h-screen flex justify-center items-center">
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : products.length === 0 ? (
            <div className="min-h-[300px] flex flex-col items-center justify-center text-gray-500">
              <svg
                className="w-16 h-16 mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 17v-6h13v6m-3-6a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg font-semibold">No products found</p>
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting your filters or check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Modal Content */}
          <div
            className={`w-64 sm:w-80 bg-white p-6 shadow-xl h-full overflow-y-auto 
      ${isClosing ? "animate-slide-out-left" : "animate-slide-in-left"}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
              <button
                className="text-gray-500 text-3xl leading-none"
                onClick={handleCloseFilter}
              >
                &times;
              </button>
            </div>
            <Filter onFilterChange={handleFilterChange} />
          </div>

          <div className="flex-1" onClick={handleCloseFilter}></div>
        </div>
      )}
      {(nextPageUrl || prevPageUrl) && (
        <div className="flex justify-center mt-10 gap-6">
          <button
            onClick={() => prevPageUrl && fetchProducts(prevPageUrl, true)}
            disabled={!prevPageUrl}
            className={`flex items-center gap-2 px-5 py-2 rounded-md border transition 
            ${
              prevPageUrl
                ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                : "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
            }`}
          >
            <FaArrowLeft />
            Previous
          </button>

          <button
            onClick={() => nextPageUrl && fetchProducts(nextPageUrl, true)}
            disabled={!nextPageUrl}
            className={`flex items-center gap-2 px-5 py-2 rounded-md border transition 
            ${
              nextPageUrl
                ? "bg-black text-white border-black hover:bg-gray-800"
                : "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
            }`}
          >
            Next
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default Shop;
