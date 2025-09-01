import { useNavigate } from "react-router-dom";
import { type IconType } from "react-icons";
import { useAuth } from "../../hooks/useAuth"; // adjust path if needed
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";

type SidebarLinkProps = {
  to: string;
  icon: IconType;
  label: string;
  isOpen: boolean;
  isActive?: boolean;
};

export const SidebarLink = ({
  to,
  icon: Icon,
  label,
  isOpen,
  isActive,
}: SidebarLinkProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();

  const handleClick = (e: React.MouseEvent) => {
    if (to === "/auth/signin" && label.toLowerCase().includes("logout")) {
      e.preventDefault();
      logout();
    } else {
      navigate(to);
    }
  };

  const style = css({
    color: isActive ? theme.colors.white : theme.colors.black,
    backgroundColor: isActive ? theme.colors.primary : "transparent",
    "&:hover": {
      backgroundColor: isActive
        ? theme.colors.primary
        : theme.colors.background,
      color: isActive ? theme.colors.white : theme.colors.primary,
    },
  });

  return (
    <button
      title={label}
      onClick={handleClick}
      className={`w-full text-left flex ${
        isOpen ? "justify-start" : "justify-center"
      } items-center gap-3 p-2 rounded-md transition text-sm ${style}`}
    >
      <Icon className="text-lg" />
      {isOpen && <span>{label}</span>}
    </button>
  );
};
