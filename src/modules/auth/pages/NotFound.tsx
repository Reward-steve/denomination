import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-lg mb-8 text-center">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="auth" textSize="lg">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}

export default NotFound;
