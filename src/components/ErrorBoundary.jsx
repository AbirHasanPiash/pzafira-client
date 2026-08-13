import { Component } from "react";

/**
 * Keeps a render error inside the content area instead of blanking the app.
 *
 * It also covers the one failure mode that code splitting introduces: after a
 * redeploy, a tab left open still references the previous build's chunk names,
 * so the next lazy import 404s. That case is detected and offered a reload,
 * which pulls the current build.
 */
const isChunkLoadError = (error) =>
  /Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed/i.test(
    error?.message ?? ""
  );

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Route error:", error, info);
  }

  handleReload = () => window.location.reload();

  handleRetry = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const staleBuild = isChunkLoadError(error);

    return (
      <section className="container mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          {staleBuild ? "A new version is available" : "Something went wrong"}
        </h1>
        <p className="mt-3 text-gray-500">
          {staleBuild
            ? "This page was updated while your tab was open. Reload to pick up the latest version."
            : "This section failed to load. You can try again, or reload the page."}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={this.handleReload}
            className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white shadow-md transition hover:bg-gray-800"
          >
            Reload the page
          </button>
          {!staleBuild && (
            <button
              onClick={this.handleRetry}
              className="rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
            >
              Try again
            </button>
          )}
        </div>
      </section>
    );
  }
}

export default ErrorBoundary;
