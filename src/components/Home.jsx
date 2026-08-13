import { Suspense, lazy, useEffect } from "react";
import { preload } from "swr";
import Hero from "./Hero";
import fetcher from "../api/fetcher";

/**
 * Only the hero is in the initial bundle. Everything below the fold — and the
 * animation library those sections depend on — is fetched as a separate chunk
 * once the page has painted.
 */
const Carousel = lazy(() => import("./Carousel"));
const Features = lazy(() => import("./Features"));
const TrendingNow = lazy(() => import("./TrendingNow"));
const OfferSection = lazy(() => import("./OfferSection"));
const NewsletterForm = lazy(() => import("./NewsletterForm"));

/** Warmed so that opening the shop from the navbar renders with data already in hand. */
const CATALOGUE_ROUTES = [
  "/products/api/detail-products/",
  "/products/api/detail-products/?target_audience=men",
  "/products/api/detail-products/?target_audience=women",
  "/products/api/detail-products/?target_audience=kids",
];

const SectionPlaceholder = () => <div className="section-placeholder" aria-hidden="true" />;

const Home = () => {
  useEffect(() => {
    /**
     * Deferred to idle time. These requests previously ran during render, so
     * four catalogue calls competed with the hero image for bandwidth on the
     * very first paint.
     */
    const warmCatalogue = () => {
      CATALOGUE_ROUTES.forEach((route) => preload(route, fetcher));
    };

    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(warmCatalogue, { timeout: 2500 });
      return () => window.cancelIdleCallback(handle);
    }

    const timer = setTimeout(warmCatalogue, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero />
      <Suspense fallback={<SectionPlaceholder />}>
        <Carousel />
        <Features />
        <TrendingNow />
        <OfferSection endDate="2026-11-30T23:59:59" />
        <NewsletterForm />
      </Suspense>
    </>
  );
};

export default Home;
