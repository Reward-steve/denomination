import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import logo from "../images/delogo.png";

interface HeaderProps {
  setShowLogin: (value: React.SetStateAction<boolean>) => void;
  setShowSignup?: (value: React.SetStateAction<boolean>) => void;
  onContactClick?: () => void;
  title?: string;
}

export function Header({
  setShowLogin,
  setShowSignup,
  onContactClick,
  title = "UCCA",
}: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 w-full flex items-center justify-between z-20 px-6 py-4">
      {/* Logo + Title */}
      <Link to="/" className="flex items-center space-x-2">
        <div className="h-10 w-10 flex-shrink-0 border-4 border-border rounded-full">
          <img
            src={logo}
            alt={`${title} logo`}
            className="h-full w-full object-contain"
          />
        </div>
        <span className="text-slate-200 font-bold text-2xl tracking-tight">
          {title}
        </span>
      </Link>

      {/* Actions */}
      <nav className="flex items-center gap-2 sm:gap-3">
        {onContactClick && (
          <Button
            variant="secondary"
            textSize="xs"
            size="sm"
            aria-label="Contact"
            onClick={onContactClick}
          >
            Contact
          </Button>
        )}

        {setShowSignup && (
          <Button
            variant="secondary"
            textSize="xs"
            size="sm"
            aria-label="Sign Up"
            onClick={() => setShowSignup(true)}
          >
            Sign Up
          </Button>
        )}

        <Button
          variant="primary"
          textSize="xs"
          size="sm"
          aria-label="Login"
          onClick={() => setShowLogin(true)}
        >
          Login
        </Button>
      </nav>
    </header>
  );
}
