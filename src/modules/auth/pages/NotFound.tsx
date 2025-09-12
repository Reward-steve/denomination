import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";

/**
 * NotFound Page (404)
 * ------------------------------------------------
 * Shown when a user navigates to a non-existent route.
 * Offers a clear message and a call-to-action
 * to return to the homepage.
 */
function NotFound() {
  return (
    <main className="w-full flex justify-center items-center px-4">
      <section
        className="min-h-screen max-w-md flex flex-col items-center justify-center text-center text-text"
        role="alert"
      >
        {/* 404 Code */}
        <h1 className="text-7xl sm:text-8xl font-extrabold text-accent mb-4">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
          Page Not Found
        </h2>

        {/* Message */}
        <p className="text-base sm:text-lg mb-8 text-text-placeholder leading-relaxed">
          Sorry, we can’t find the page you’re looking for. It may have been
          moved or no longer exists.
        </p>

        {/* CTA */}
        <Link to="/" className="w-full sm:w-auto">
          <Button variant="auth" textSize="sm" className="w-full sm:w-auto">
            Back to Home
          </Button>
        </Link>
      </section>
    </main>
  );
}

export default NotFound;
