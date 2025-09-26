import {
  FaBell,
  FaSearch,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";

import { useLocation, useNavigate } from "react-router-dom";
import { useResponsive } from "../../hooks/useResponsive";
import { useTheme } from "../../hooks/useTheme";
import { lightTheme } from "../../utils/themes";
import { useEffect, useState, useRef } from "react";
import type { User } from "../../types/auth.types";
import type { Theme } from "@emotion/react";
import clsx from "clsx";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const { isMobile } = useResponsive();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const [currentUser, setCurrentUser] = useState<User>();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (user) setCurrentUser(user as User);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const pageTitle =
    location.pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()) || "Dashboard";

  const handleBack = () => navigate(-1);

  return (
    <nav className="sticky top-0 z-50 bg-background sm:border-none border-b border-border">
      {isMobile ? (
        <MobileHeader
          title={pageTitle}
          onBack={handleBack}
          user={currentUser}
          theme={theme}
          toggleTheme={toggleTheme}
          logout={logout}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          menuRef={menuRef}
        />
      ) : (
        <DesktopHeader
          theme={theme}
          toggleTheme={toggleTheme}
          user={currentUser}
          logout={logout}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          menuRef={menuRef}
        />
      )}
    </nav>
  );
}

// --- Import your default logo ---
import defaultLogo from "../../../public/logo.png";

// ---------------- MOBILE HEADER ----------------
function MobileHeader({
  title,
  theme,
  toggleTheme,
  logout,
  menuOpen,
  setMenuOpen,
  menuRef,
  user,
}: any) {
  const profilePic = user?.profile_pic || defaultLogo;

  return (
    <div className="flex items-center justify-end p-3 relative shadow-sm">
      <div className="w-[100%] flex justify-between items-center">

        <div className="w-[35px]"> </div>

        <h1 className="text-base font-semibold truncate text-text-placeholder">
          {title}
        </h1>

        <div className="flex items-center gap-3 relative" ref={menuRef}>
          <FaBell className="text-primary text-lg cursor-pointer" />
          <button onClick={() => setMenuOpen((p: boolean) => !p)}>
            <img
              src={profilePic}
              alt={user?.first_name || "user_profile"}
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>

          {menuOpen && (
            <ProfileMenu
              theme={theme}
              toggleTheme={toggleTheme}
              logout={logout}
            />
          )}
        </div>

      </div>
    </div>
  );
}

// ---------------- DESKTOP HEADER ----------------
function DesktopHeader({
  search,
  setSearch,
  theme,
  toggleTheme,
  user,
  logout,
  menuOpen,
  setMenuOpen,
  menuRef,
}: any) {
  const profilePic = user?.photo || defaultLogo;

  return (
    <div className="h-16 flex justify-center items-end w-full border-b border-border">
      <div className="h-full w-full flex items-center justify-between bg-surface px-4 relative">
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
        <div className="flex items-center gap-4 ml-4 relative" ref={menuRef}>
          <FaBell className="text-primary text-lg cursor-pointer" />

          <button
            onClick={() => setMenuOpen((p: boolean) => !p)}
            className="flex items-center gap-2"
          >
            <img
              src={profilePic}
              alt={user?.first_name || "user_profile"}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-text">
              {user?.first_name || "Guest"}
            </span>
          </button>

          {menuOpen && (
            <ProfileMenu
              theme={theme}
              toggleTheme={toggleTheme}
              logout={logout}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- PROFILE MENU (Shared) ---------------- */
function ProfileMenu({
  theme,
  toggleTheme,
  logout,
}: {
  theme: Theme;
  toggleTheme: () => void;
  logout: () => void;
}) {
  return (
    <div className="absolute right-0 top-12 w-48 bg-surface border border-border rounded-lg shadow-md overflow-hidden animate-fade">
      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-text hover:bg-accent hover:text-white transition-colors"
      >
        {theme !== lightTheme ? <FaSun /> : <FaMoon />}
        {theme !== lightTheme ? "Light Mode" : "Dark Mode"}
      </button>

      <button
        disabled
        className={clsx(
          "flex items-center gap-2 w-full px-4 py-2 text-sm cursor-not-allowed",
          "text-text-placeholder bg-surface"
        )}
      >
        <FaCog /> Settings
      </button>

      <button
        onClick={logout}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white transition-colors"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}
