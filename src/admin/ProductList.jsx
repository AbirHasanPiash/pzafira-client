import { useEffect, useState, useCallback, useRef, useLayoutEffect } from "react";
import api from "../api/axios";
import ProductCard from "./ProductCard";
import debounce from "lodash/debounce";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const shouldScrollRef = useRef(false);

  const LOCAL_CACHE_KEY = "pzafira_products_cache";

  const PAGE_SIZE = 20;

  const fetchProducts = async (search = "", page = 1, scrollToTop = false) => {
    if (scrollToTop) shouldScrollRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("page", page);

      const response = await api.get(
        `/products/api/detail-products/?${params}`
      );
      const productData = response.data.results || [];

      setProducts(productData);

      // Calculate total pages from count and PAGE_SIZE
      const count = response.data.count || 0;
      setTotalPages(Math.ceil(count / PAGE_SIZE));

      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(productData));
    } catch (err) {
      console.error("Error fetching products:", err);
      const fallback = localStorage.getItem(LOCAL_CACHE_KEY);
      if (fallback) {
        setProducts(JSON.parse(fallback));
        toast.warn("Using cached data due to error.");
      } else {
        setError("Failed to load products.");
      }
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchProducts, 500), []);

  useLayoutEffect(() => {
    if (shouldScrollRef.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      shouldScrollRef.current = false;
    }
  }, [products]);

  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_CACHE_KEY);
    if (cached) {
      setProducts(JSON.parse(cached));
      setLoading(false);
    }
    fetchProducts("", 1, true);
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedFetch(searchTerm, 1, true);
      setCurrentPage(1);
    }
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      shouldScrollRef.current = true;
      fetchProducts(searchTerm, newPage, true);
    }
  };

  return (
    <section className="pl-4 md:pl-8 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="w-full md:w-1/2 px-4 py-2 border rounded-md shadow-sm"
        />
        <NavLink
          to="/admin/products/create"
          className="bg-black text-white px-1 py-2 rounded-md text-sm font-semibold hover:bg-gray-800 transition"
        >
          + Add Product
        </NavLink>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500">No products found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
