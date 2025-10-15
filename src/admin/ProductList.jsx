import { useEffect, useState, useCallback, useLayoutEffect, useMemo } from "react";
import useSWR, { mutate } from "swr";
import ProductCard from "./ProductCard";
import debounce from "lodash/debounce";
import { NavLink } from "react-router-dom";

export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [shouldScroll, setShouldScroll] = useState(false);

  const PAGE_SIZE = 20;

  // Global SWR fetcher is already set in SWRConfig (assumed)
  const { data, error, isLoading } = useSWR(
    `/products/api/detail-products/?page=${currentPage}`
  );

  const allProducts = data?.results || [];
  const totalPages = data?.count ? Math.ceil(data.count / PAGE_SIZE) : 1;

  // === Prefetch next page if exists ===
  useEffect(() => {
    if (data && currentPage < totalPages) {
      const nextPageUrl = `/products/api/detail-products/?page=${currentPage + 1}`;
      mutate(
        nextPageUrl,
        async (prev) => {
          // Only fetch if not already cached
          if (!prev) {
            const res = await fetch(nextPageUrl);
            return res.json();
          }
          return prev;
        },
        { revalidate: false }
      );
    }
  }, [data, currentPage, totalPages]);


  // === Client-side search filtering ===
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return allProducts;
    const term = searchTerm.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term) ||
        p.brand?.toLowerCase().includes(term)
    );
  }, [allProducts, searchTerm]);

  // === Scroll to top on page change ===
  useLayoutEffect(() => {
    if (shouldScroll) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setShouldScroll(false);
    }
  }, [allProducts]);

  // === Debounced search handler ===
  const debouncedSearch = useCallback(
    debounce((value) => setSearchTerm(value), 300),
    []
  );

  const handleSearchChange = (e) => debouncedSearch(e.target.value);

  // === Page navigation ===
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setShouldScroll(true);
    }
  };

  // === Error & Loading states ===
  if (isLoading)
    return <div className="text-center py-10">Loading products...</div>;

  if (error)
    return (
      <div className="text-center text-red-500">
        Failed to load products.
      </div>
    );

  return (
    <section className="pl-4 md:pl-8 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
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

      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500">No products found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
