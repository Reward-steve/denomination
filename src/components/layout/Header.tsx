import { FaSearch, FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";

import { useLocation, useNavigate } from "react-router-dom";
import { useResponsive } from "../../hooks/useResponsive";
import { useTheme } from "../../hooks/useTheme";
import { lightTheme } from "../../utils/themes";
import { useEffect, useState, useRef } from "react";
import type { User } from "../../types/auth.types";
import type { Theme } from "@emotion/react";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const { isMobile } = useResponsive();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

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
          user={user}
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
          user={user}
          logout={logout}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          menuRef={menuRef}
        />
      )}
    </nav>
  );
}

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
  return (
    <div className="flex items-center justify-end p-3 relative shadow-sm">
      <div className="w-[100%] flex justify-between items-center">
        <div className="w-[35px]"> </div>

        <h1 className="text-base font-semibold truncate text-text-placeholder">
          {title}
        </h1>

        <div className="flex items-center gap-3 relative" ref={menuRef}>
          <button onClick={() => setMenuOpen((p: boolean) => !p)}>
            <img
              src={
                user.photo
                  ? `${import.meta.env.VITE_BASE_URL.split("/api/")[0]}/${
                      user.photo
                    }`
                  : defaultLogo
              }
              alt={`${user.first_name} ${user.last_name}`}
              className="w-8 h-8 rounded-full object-cover border border-border"
            />
          </button>

          {menuOpen && (
            <ProfileMenu
              user={user}
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
          <button
            onClick={() => setMenuOpen((p: boolean) => !p)}
            className="flex items-center gap-2"
          >
            <img
              src={
                user.photo
                  ? `${import.meta.env.VITE_BASE_URL.split("/api/")[0]}/${
                      user.photo
                    }`
                  : defaultLogo
              }
              alt={`${user.first_name} ${user.last_name}`}
              className="w-8 h-8 rounded-full object-cover border border-border"
            />
            <span className="text-sm font-medium text-text">
              {user?.first_name || "Guest"}
            </span>
          </button>

          {menuOpen && (
            <ProfileMenu
              user={user}
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
  user,
  theme,
  toggleTheme,
  logout,
}: {
  user: User;
  theme: Theme;
  toggleTheme: () => void;
  logout: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="absolute right-0 top-12 w-48 bg-surface border border-border rounded-lg shadow-md overflow-hidden animate-fade">
      {/* Profile */}
      <button
        onClick={() => navigate(`/dashboard/users/${user.id}/profile`)}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-text hover:bg-accent hover:text-white transition-colors"
      >
        <img
          src={
            user.photo
              ? `${import.meta.env.VITE_BASE_URL.split("/api/")[0]}/${
                  user.photo
                }`
              : defaultLogo
          }
          alt={`${user.first_name} ${user.last_name}`}
          className="w-5 h-5 rounded-full object-cover"
        />
        View Profile
      </button>

      {/* Theme */}
      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-text hover:bg-accent hover:text-white transition-colors"
      >
        {theme !== lightTheme ? <FaSun /> : <FaMoon />}
        {theme !== lightTheme ? "Light Mode" : "Dark Mode"}
      </button>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white transition-colors"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}
