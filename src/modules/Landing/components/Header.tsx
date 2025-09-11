import { Button } from "../../../components/ui/Button";

interface HeaderProps {
  setShowLogin: (value: React.SetStateAction<boolean>) => void;
  setShowSignup?: (value: React.SetStateAction<boolean>) => void;
  onContactClick?: () => void;
}

export function Header({
  setShowLogin,
  setShowSignup,
  onContactClick,
}: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 w-full flex items-center justify-between z-20 px-6 py-4">
      {/* Logo + Title */}
      <div className="flex items-center space-x-2">
        <div className="bg-primary h-10 w-10 rounded-full flex items-center justify-center font-bold text-white shadow-md">
          D
        </div>
        <span className="text-slate-200 font-bold text-2xl tracking-tight">
          enomination
        </span>
      </div>

      {/* Actions */}
      <nav className="flex items-center gap-2 sm:gap-3">
        {onContactClick && (
          <Button
            variant="secondary"
            textSize="xs"
            size="sm"
            className="h-auto"
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
            className="h-auto"
            onClick={() => setShowSignup(true)}
          >
            Sign Up
          </Button>
        )}

        <Button
          variant="primary"
          textSize="xs"
          size="sm"
          className="h-auto"
          onClick={() => setShowLogin(true)}
        >
          Login
        </Button>
      </nav>
    </header>
  );
}
