import { Link } from "react-router-dom";
import logo from "../../assets/img/logo.png";

export default function Logo({ isCollapsed }: { isCollapsed?: boolean }) {
  return (
    <Link to="#" className="flex items-center text-lg font-bold text-secondary">
      {!isCollapsed && (
        <>
          <img
            src={logo}
            alt="logo"
            className="w-12 h-12 transition-all duration-500 overflow-x-hidden"
          />
          <span className="text-md whitespace-nowrap">Skoolpilot</span>
        </>
      )}
    </Link>
  );
}
