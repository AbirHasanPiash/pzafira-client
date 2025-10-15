import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import useSWR from "swr";
import { uniqBy } from "lodash";
import ProductCard from "./ProductCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Filter from "./Filter";
import { useLocation } from "react-router-dom";

const Shop = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [filters, setFilters] = useState({});
  const [pageUrl, setPageUrl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const shouldScrollRef = useRef(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const targetAudience = queryParams.get("target_audience");

  const baseEndpoint = "/products/api/detail-products/";
  const endpoint =
    pageUrl ||
    (targetAudience
      ? `${baseEndpoint}?target_audience=${targetAudience}`
      : baseEndpoint);

  // Fetch once from API
  const { data, error, isLoading } = useSWR(endpoint);


  useEffect(() => {
    setFilters({});
    setPageUrl(null);
    shouldScrollRef.current = true;
  }, [targetAudience]);

  // normalize incoming products
  const rawProducts = data?.results || [];
  const allProducts = uniqBy(rawProducts, "id");

  const nextPageUrl = data?.next || null;
  const prevPageUrl = data?.previous || null;

  // 🔹 Save state (cache products)
  useEffect(() => {
    if (data) {
      localStorage.setItem(
        "cachedProducts",
        JSON.stringify({
          timestamp: Date.now(),
          data: allProducts,
        })
      );
    }
  }, [data, allProducts]);

  // 🔹 Restore cache
  const [cachedProducts, setCachedProducts] = useState([]);
  useEffect(() => {
    const cached = localStorage.getItem("cachedProducts");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setCachedProducts(parsed.data || []);
      } catch (err) {
        // ignore invalid cache
        setCachedProducts([]);
      }
    }
  }, []);

  const products = allProducts.length ? allProducts : cachedProducts;

  // 🔹 Dynamic filter field setup
  const filterOptions = useMemo(() => {
    if (!products || products.length === 0) return {};

    // categories and brands can be either a string or an object with `name`
    const categories = [
      ...new Set(
        products
          .map((p) => {
            if (!p) return null;
            return p.category?.name ?? p.category ?? null;
          })
          .filter(Boolean)
      ),
    ];
    const brands = [
      ...new Set(
        products
          .map((p) => {
            if (!p) return null;
            return p.brand?.name ?? p.brand ?? null;
          })
          .filter(Boolean)
      ),
    ];

    // collect all variant prices across all products
    const allVariantPrices = products.flatMap((p) =>
      (p.variants || [])
        .map((v) => {
          const n = Number(v?.price ?? v?.price);
          return Number.isFinite(n) ? n : 0;
        })
        .filter((n) => !isNaN(n))
    );

    // fallback if no variant prices exist
    const minPrice =
      allVariantPrices.length > 0 ? Math.min(...allVariantPrices) : 0;
    const maxPrice =
      allVariantPrices.length > 0 ? Math.max(...allVariantPrices) : 20000;

    return { categories, brands, minPrice, maxPrice };
  }, [products]);

  // 🔹 Apply filters instantly (frontend only)
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter (category may be string or object)
    if (filters.category) {
      filtered = filtered.filter((p) => {
        const cat = (p.category?.name ?? p.category ?? "").toString();
        return cat === filters.category;
      });
    }

    // Brand filter
    if (filters.brand) {
      filtered = filtered.filter((p) => {
        const b = (p.brand?.name ?? p.brand ?? "").toString();
        return b === filters.brand;
      });
    }

    // Price filter: include product if any variant price is inside range
    if ("minPrice" in filters || "maxPrice" in filters) {
      const min = Number(filters.minPrice ?? 0);
      const max = Number(
        filters.maxPrice !== undefined ? filters.maxPrice : Infinity
      );

      filtered = filtered.filter((p) => {
        const variantPrices = (p.variants || []).map((v) =>
          Number(v?.price ?? 0)
        );
        // if no variants, try top-level price
        if (variantPrices.length === 0) {
          const price = Number(p.price ?? 0);
          return price >= min && price <= max;
        }
        return variantPrices.some((pr) => pr >= min && pr <= max);
      });
    }

    // Search
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      filtered = filtered.filter((p) => {
        const name = (p.name ?? "").toString().toLowerCase();
        const desc = (p.description ?? "").toString().toLowerCase();
        return name.includes(s) || desc.includes(s);
      });
    }

    return filtered;
  }, [products, filters, searchTerm]);

  // 🔹 Smooth scroll
  useLayoutEffect(() => {
    if (shouldScrollRef.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      shouldScrollRef.current = false;
    }
  }, [filteredProducts]);

  // 🔹 Handlers
  // only update state when filters actually changed (prevent infinite updates)
  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => {
      const prevJson = JSON.stringify(prev ?? {});
      const newJson = JSON.stringify(newFilters ?? {});
      if (prevJson === newJson) return prev; // no change -> do nothing
      return newFilters;
    });
  }, []);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleCloseFilter = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsFilterOpen(false);
      setIsClosing(false);
    }, 400);
  };

  const handleNextPage = () => {
    if (nextPageUrl) {
      setPageUrl(nextPageUrl);
      shouldScrollRef.current = true;
    }
  };

  const handlePrevPage = () => {
    if (prevPageUrl) {
      setPageUrl(prevPageUrl);
      shouldScrollRef.current = true;
    }
  };

  return (
    <div className="container px-6 sm:px-10 md:px-16 max-w-7xl mt-20 mx-auto pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between lg:justify-center gap-4 mb-6">
        <button
          className="lg:hidden text-sm font-semibold bg-black text-white rounded-md px-4 py-2 w-full sm:w-auto"
          onClick={() => setIsFilterOpen(true)}
        >
          Filters
        </button>

        {/* 🔹 Instant Search Bar */}
        <div className="relative w-full sm:w-96 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-60 bg-white rounded-lg p-5 shadow-md">
          <div className="flex justify-center items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
          </div>
          <Filter
            onFilterChange={handleFilterChange}
            options={filterOptions}
            appliedFilters={filters}
          />
        </aside>

        {/* Product Grid */}
        <section className="flex-1">
          {isLoading ? (
            <div className="min-h-screen flex justify-center items-center">
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              Failed to load products.
            </div>
          ) : filteredProducts.length === 0 ? (
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
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
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
            <Filter
              onFilterChange={handleFilterChange}
              options={filterOptions}
              appliedFilters={filters}
            />
          </div>
          <div className="flex-1" onClick={handleCloseFilter}></div>
        </div>
      )}

      {/* Pagination */}
      {(nextPageUrl || prevPageUrl) && (
        <div className="flex justify-center mt-10 gap-6">
          <button
            onClick={handlePrevPage}
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
            onClick={handleNextPage}
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
