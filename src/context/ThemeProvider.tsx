import { useEffect, useState, type ReactNode } from "react";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { lightTheme, darkTheme } from "../utils/themes";
import type { Theme } from "@emotion/react";
import { ThemeContext } from "../hooks/useTheme";
import GlobalStyles from "../components/layout/GlobalStyle";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") return lightTheme;
    if (stored === "dark") return darkTheme;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark ? darkTheme : lightTheme;
  });

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === lightTheme ? darkTheme : lightTheme
    );
  };
  // Sync background, localStorage, and HTML class
  useEffect(() => {
    document.body.style.background = theme.colors.background;

    const isDark = theme === darkTheme;
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [theme]);

  const value = { theme, setTheme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      <EmotionThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </EmotionThemeProvider>
    </ThemeContext.Provider>
  );
};
