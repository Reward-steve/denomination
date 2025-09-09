import { FaBell, FaSearch, FaMoon, FaSun } from "react-icons/fa";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useResponsive } from "../../hooks/useResponsive";
import { useTheme } from "../../hooks/useTheme";
import img from "../../../public/de.png";
import { lightTheme } from "../../utils/themes";
import { useEffect, useState } from "react";
import type { UserDetails } from "../../types/auth.types";
import { getFromStore } from "../../utils/appHelpers";

export default function Header() {
  const { isMobile } = useResponsive();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [user, setUser] = useState<UserDetails>();

  const { theme, toggleTheme } = useTheme();

  const toggleSearch = () => {
    setOpenSearch((prev) => !prev);
    setSearch("");
  };

  useEffect(() => {
    const curr_user = getFromStore("curr_user");
    if (curr_user) {
      setUser(curr_user as UserDetails);
    }
  }, []);

  const pageTitle =
    location.pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()) || "Dashboard";

  return (
    <nav className="sticky top-0 z-50 md:py-2 bg-background">
      {isMobile ? (
        <div className="flex items-center justify-between bg-smooth px-4 py-2">
          <button onClick={() => navigate(-1)}>
            <MdOutlineKeyboardArrowLeft className="text-2xl text-subText" />
          </button>
          {openSearch ? (
            <input
              placeholder="search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white py-2 px-6 w-[80%] animate-fade duration-300 border border-border outline-none rounded-xl"
              autoFocus
            />
          ) : (
            <h1 className="text-base font-semibold truncate text-subText">
              {pageTitle}
            </h1>
          )}
          <button onClick={toggleSearch}>
            <FaSearch className="text-md text-subText" />
          </button>
        </div>
      ) : (
        <div className="h-14 flex items-center justify-between bg-surface border border-border px-4 rounded-md transition-colors">
          <form className="flex-1 max-w-md">
            <label className="flex items-center gap-2 p-2 border border-border rounded-md w-full bg-smooth">
              <FaSearch className="text-surface" />
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 border-none outline-none bg-transparent text-text"
              />
            </label>
          </form>

          <div className="flex items-center gap-4 ml-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-border hover:bg-smooth transition"
              aria-label="Toggle Theme"
            >
              {theme !== lightTheme ? (
                <FaSun className="text-yellow-400 hover:text-yellow-500" />
              ) : (
                <FaMoon className="text-blue-400 hover:text-blue-500" />
              )}
            </button>

            <FaBell className="text-primary text-lg" />
            <img
              src={img}
              alt="user_profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-black">
              {user?.first_name}
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}
