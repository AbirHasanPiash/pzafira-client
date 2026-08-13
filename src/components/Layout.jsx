import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ErrorBoundary from "./ErrorBoundary";
import { RouteFallback } from "./Skeletons";

/**
 * The navbar and footer stay mounted across navigations; only the content area
 * suspends. That keeps the shell — and the cart/wishlist badges in it — stable
 * while a lazily loaded route is fetched.
 */
const Layout = () => (
  <>
    <Navbar />
    <main className="min-h-[60vh]">
      <ErrorBoundary>
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </main>
    <Footer />
  </>
);

export default Layout;
