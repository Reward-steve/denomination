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
import type { Theme } from "@emotion/react";

export default function Header() {
  const { isMobile } = useResponsive();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [search, setSearch] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const curr_user = getFromStore("curr_user");
    if (curr_user) setUser(curr_user as User);
  }, []);

  const pageTitle =
    location.pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()) || "Dashboard";

  /** Handlers */
  const handleSearchToggle = () => {
    setOpenSearch((prev) => !prev);
    setSearch("");
  };

  const handleBack = () => navigate(-1);

  return (
    <nav className="sticky top-2 z-50 bg-background border-b border-border">
      {isMobile ? (
        <MobileHeader
          title={pageTitle}
          search={search}
          setSearch={setSearch}
          openSearch={openSearch}
          onToggleSearch={handleSearchToggle}
          onBack={handleBack}
        />
      ) : (
        <DesktopHeader
          search={search}
          setSearch={setSearch}
          theme={theme}
          toggleTheme={toggleTheme}
          user={user}
        />
      )}
    </nav>
  );
}

/* ---------------- MOBILE HEADER ---------------- */
function MobileHeader({
  title,
  search,
  setSearch,
  openSearch,
  onToggleSearch,
  onBack,
}: {
  title: string;
  search: string;
  setSearch: (val: string) => void;
  openSearch: boolean;
  onToggleSearch: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-2 px-3">
      {/* Back Button */}
      <button onClick={onBack} aria-label="Go Back">
        <MdOutlineKeyboardArrowLeft className="text-2xl text-text-placeholder" />
      </button>

      {/* Center: Title / Search */}
      <div className="flex-1 flex items-center justify-center">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`transition-all duration-300 ease-in-out border border-border rounded-lg bg-background px-4 py-2
            ${
              openSearch
                ? "w-[90%] opacity-100"
                : "w-0 opacity-0 pointer-events-none"
            }
          `}
          autoFocus={openSearch}
        />
        {!openSearch && (
          <h1 className="text-base font-semibold truncate text-text-placeholder">
            {title}
          </h1>
        )}
      </div>

      {/* Toggle Search */}
      <button onClick={onToggleSearch} aria-label="Search">
        <FaSearch className="text-md text-text-placeholder" />
      </button>
    </div>
  );
}

/* ---------------- DESKTOP HEADER ---------------- */
function DesktopHeader({
  search,
  setSearch,
  theme,
  toggleTheme,
  user,
}: {
  search: string;
  setSearch: (val: string) => void;
  theme: Theme;
  toggleTheme: () => void;
  user?: User;
}) {
  return (
    <div className="h-14 flex items-center justify-between bg-surface border border-border px-4 rounded-md">
      {/* Search Bar */}
      <form className="flex-1 max-w-md">
        <label className="flex items-center gap-2 p-2 border border-border rounded-md w-full bg-smooth">
          <FaSearch className="text-surface" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border-none outline-none bg-transparent text-text"
          />
        </label>
      </form>

      {/* Right Side */}
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

        {/* Notifications */}
        <FaBell className="text-primary text-lg cursor-pointer" />

        {/* User Avatar */}
        <div className="flex items-center gap-2">
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
    </div>
  );
}
