import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets the scroll position on navigation.
 *
 * Only the pathname is watched: changing the query string (shop filters,
 * pagination) keeps the reader where they are, while moving to a different page
 * starts at the top. `instant` avoids a visible glide on every route change.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
