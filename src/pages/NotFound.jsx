import { Link } from "react-router-dom";

const NotFound = () => (
  <section className="container mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-6 py-20 text-center sm:px-10 md:px-16">
    <p className="text-6xl font-extrabold text-gray-900 sm:text-7xl">404</p>
    <h1 className="mt-4 text-2xl font-bold text-gray-800 sm:text-3xl">
      This page isn&apos;t here
    </h1>
    <p className="mt-3 max-w-md text-gray-500">
      The link may be out of date, or the page may have moved. Let&apos;s get
      you back to something that fits.
    </p>

    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Link
        to="/shop"
        className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white shadow-md transition hover:bg-gray-800"
      >
        Browse the shop
      </Link>
      <Link
        to="/"
        className="rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
      >
        Back to home
      </Link>
    </div>
  </section>
);

export default NotFound;
