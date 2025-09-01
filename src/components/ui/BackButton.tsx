import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

type BackButtonProps = {
  to?: string; // Optional target route
  label?: string; // Optional label (e.g. "Back", "Return")
  className?: string; // Optional styling override
};

export function BackButton({ to, label, className = "" }: BackButtonProps) {
  const navigate = useNavigate();
  const baseClass =
    "flex items-center sm:hidden text-black font-semibold gap-2 h-10 transition-colors duration-200";

  if (to) {
    return (
      <Link to={to} className={`${baseClass} ${className}`}>
        <FaArrowLeft />
        {label && <span>{label}</span>}
      </Link>
    );
  }

  return (
    <button
      onClick={() => navigate(-1)}
      className={`${baseClass} ${className}`}
    >
      <FaArrowLeft />
      {label && <span>{label}</span>}
    </button>
  );
}
