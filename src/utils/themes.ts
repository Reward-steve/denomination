import "@emotion/react";
import type { Theme } from "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      accentLight: string;
      text: string;
      textSecondary: string;
      textPlaceholder: string;
      background: string;
      surface: string;
      border: string;
      neutral: string;
      error: string;
    };
    typography: {
      fontFamily: string;
      fontSize: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
      };
      fontWeight: {
        regular: number;
        medium: number;
        bold: number;
      };
      lineHeight: string;
    };
    spacing: {
      unit: number;
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
    };
  }
}

// 🌤️ Modern & Serene Light Theme
export const lightTheme: Theme = {
  colors: {
    primary: "rgb(99, 102, 241)", // Spiritual and calming blue
    secondary: "rgb(250, 204, 21)", // Hopeful yellow
    accent: "rgb(59, 130, 248)", // Vibrant blue (aligned with Tailwind)
    accentLight: "#3B82F640", // Semi-transparent accent
    text: "rgb(31, 41, 55)", // Readable dark gray
    textSecondary: "rgb(75, 85, 99)", // Muted text
    textPlaceholder: "rgb(156, 163, 175)", // Light gray for placeholders
    background: "rgb(249, 250, 251)", // Soft off-white
    surface: "rgb(255, 255, 255)", // Clean white for cards
    border: "rgb(229, 231, 235)", // Subtle borders
    neutral: "rgb(209, 213, 219)", // General neutral gray
    error: "rgb(239, 68, 68)", // Red for errors
  },
  typography: {
    fontFamily: "TASA Explorer, sans-serif !important",
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    lineHeight: "1.3",
  },
  spacing: {
    unit: 8,
    xs: 0.5,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    xxl: 6,
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
  },
};

// 🌙 Soothing & Distinct Dark Theme
export const darkTheme: Theme = {
  colors: {
    primary: "rgb(129, 140, 248)", // Softer blue for dark mode
    secondary: "rgb(251, 191, 36)", // Slightly muted yellow
    accent: "rgb(59, 130, 246)", // Keep consistent with light theme
    accentLight: "#3B82F640", // Semi-transparent accent
    text: "rgb(243, 244, 246)", // Light gray for readable text
    textSecondary: "rgb(209, 213, 219)", // Muted light gray
    textPlaceholder: "rgb(107, 114, 128)", // Subtle gray for placeholders
    background: "rgb(17, 24, 39)", // Deep, soothing navy-gray
    surface: "rgb(31, 41, 55)", // Dark gray for cards
    border: "rgb(55, 65, 81)", // Darker borders
    neutral: "rgb(75, 85, 99)", // Neutral gray for secondary elements
    error: "rgb(248, 113, 113)", // Softer red for errors
  },
  typography: {
    fontFamily: "TASA Explorer, sans-serif !important",
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    lineHeight: "1.3",
  },
  spacing: {
    unit: 8,
    xs: 0.5,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    xxl: 6,
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
  },
};
