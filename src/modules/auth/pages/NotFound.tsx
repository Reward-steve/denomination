import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";

function NotFound() {
  return (
    <main className="w-full flex justify-center items-center text-center">
      <div className="min-h-screen max-w-md flex flex-col items-center justify-center text-text">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-lg mb-8 text-textPlaceholder">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="w-full">
          <Button variant="auth" textSize="lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
