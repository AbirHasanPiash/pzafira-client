/**
 * Shared loading placeholders.
 *
 * Skeletons are preferred over spinners: they reserve the final layout, so the
 * page does not shift when data arrives, and they read as "almost there"
 * rather than "nothing is happening".
 */

export const Shimmer = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
);

/** Page-level fallback for lazily loaded routes. */
export const RouteFallback = () => (
  <div
    className="container max-w-7xl mx-auto px-6 sm:px-10 md:px-16 py-16"
    role="status"
    aria-label="Loading page"
  >
    <Shimmer className="h-9 w-2/5 mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="space-y-3">
          <Shimmer className="h-44 w-full" />
          <Shimmer className="h-4 w-3/4" />
          <Shimmer className="h-4 w-1/2" />
        </div>
      ))}
    </div>
    <span className="sr-only">Loading…</span>
  </div>
);

/** Matches the shop grid so cards slot straight into place. */
export const ProductGridSkeleton = ({ count = 8 }) => (
  <div
    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    role="status"
    aria-label="Loading products"
  >
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="rounded-lg bg-white p-4 shadow">
        <Shimmer className="mb-4 h-56 w-full" />
        <Shimmer className="mb-2 h-3 w-full" />
        <Shimmer className="mb-3 h-3 w-2/3" />
        <Shimmer className="h-6 w-16" />
      </div>
    ))}
    <span className="sr-only">Loading products…</span>
  </div>
);

export default RouteFallback;
