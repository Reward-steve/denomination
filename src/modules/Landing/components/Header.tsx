import { Button } from "../../../components/ui/Button";

interface HeaderProps {
  setShowLogin: (value: React.SetStateAction<boolean>) => void;
  setShowSignup?: (value: React.SetStateAction<boolean>) => void;
  onContactClick?: () => void;
}

export function Header({ setShowLogin }: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 w-full flex items-center justify-between z-20 p-6">
      {/* Logo + Title */}
      <div className="flex items-center justify-center">
        <div className="bg-primary h-10 w-10 rounded-full mr-1 flex items-center justify-center font-bold text-neutral">
          D
        </div>
        <span className="text-neutral font-bold text-2xl">enomination</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={() => setShowLogin(true)}>
          Login
        </Button>
      </div>
    </header>
  );
}
