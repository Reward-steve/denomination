import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";

function NotFound() {
  return (
    <main className="w-full flex justify-center items-center px-4">
      <div className="min-h-screen max-w-md flex flex-col items-center justify-center text-center text-text">
        {/* Big 404 */}
        <h1 className="text-7xl sm:text-8xl font-extrabold text-accent mb-4">
          404
        </h1>

        {/* Subtitle */}
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg mb-8 text-text-placeholder leading-relaxed">
          Oops! The page you’re looking for doesn’t exist or may have been
          moved. Don’t worry, you can always head back to the homepage.
        </p>

        {/* CTA */}
        <Link to="/" className="w-full sm:w-auto">
          <Button variant="auth" textSize="sm" className="w-full sm:w-auto">
            Back to Home
          </Button>
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
