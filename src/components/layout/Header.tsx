import { FaBell, FaSearch, FaMoon, FaSun } from "react-icons/fa";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useResponsive } from "../../hooks/useResponsive";
import { useTheme } from "../../hooks/useTheme";
import img from "../../../public/logo.png";
import { lightTheme } from "../../utils/themes";
import { useEffect, useState } from "react";
import type { User } from "../../types/auth.types";
import { getFromStore } from "../../utils/appHelpers";

export default function Header() {
  const { isMobile } = useResponsive();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [user, setUser] = useState<User>();

  const { theme, toggleTheme } = useTheme();

  const toggleSearch = () => {
    setOpenSearch((prev) => !prev);
    setSearch("");
  };

  useEffect(() => {
    const curr_user = getFromStore("curr_user");
    if (curr_user) {
      console.log(curr_user);
      setUser(curr_user as User);
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
        <div className="flex items-center justify-between py-2">
          <button onClick={() => navigate(-1)}>
            <MdOutlineKeyboardArrowLeft className="text-2xl bg-smooth rounded-lg text-text-placeholder" />
          </button>

          <div className="flex-1 flex items-center justify-center">
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`transition-all duration-300 ease-in-out border border-border rounded-lg bg-background 
                    px-4 py-2 ${
                      openSearch
                        ? "w-[90%] opacity-100"
                        : "w-0 opacity-0 pointer-events-none"
                    }`}
              autoFocus={openSearch}
            />
            {!openSearch && (
              <h1 className="text-base font-semibold truncate text-text-placeholder">
                {pageTitle}
              </h1>
            )}
          </div>

          <button onClick={toggleSearch}>
            <FaSearch className="text-md text-text-placeholder" />
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
            <span className="text-sm font-medium text-text">
              {user?.first_name}
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}
