import { Link } from "react-router-dom";
import logo from "../../../public/de.png";

export default function Logo({ isCollapsed }: { isCollapsed?: boolean }) {
  return (
    <Link
      to="#"
      className="flex items-center gap-2 text-lg font-bold text-secondary"
    >
      {!isCollapsed && (
        <>
          <img
            src={logo}
            alt="logo"
            className="w-12 h-12 transition-all duration-500 rounded-full border border-accent overflow-x-hidden"
          />
          <span className="text-md whitespace-nowrap">UCCA</span>
        </>
      )}
    </Link>
  );
}
