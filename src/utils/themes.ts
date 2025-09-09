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
    primary: "99 102 241", // Spiritual and calming blue
    secondary: "250 204 21", // Hopeful yellow
    accent: "59 130 248", // Vibrant blue (aligned with Tailwind)
    accentLight: "#3B82F640", // Semi-transparent accent
    text: "31 41 55", // Readable dark gray
    textSecondary: "75 85 99", // Muted text
    textPlaceholder: "156 163 175", // Light gray for placeholders
    background: "249 250 251", // Soft off-white
    surface: "255 255 255", // Clean white for cards
    border: "229 231 235", // Subtle borders
    neutral: "209 213 219", // General neutral gray
    error: "239 68 68", // Red for errors
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
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
    lineHeight: "1.5",
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
    primary: "129 140 248", // Softer blue for dark mode
    secondary: "251 191 36", // Slightly muted yellow
    accent: "59 130 246", // Keep consistent with light theme
    accentLight: "#3B82F640", // Semi-transparent accent
    text: "243 244 246", // Light gray for readable text
    textSecondary: "209 213 219", // Muted light gray
    textPlaceholder: "107 114 128", // Subtle gray for placeholders
    background: "17 24 39", // Deep soothing navy-gray
    surface: "31 41 55", // Dark gray for cards
    border: "55 65 81", // Darker borders
    neutral: "75 85 99", // Neutral gray for secondary elements
    error: "248 113 113", // Softer red for errors
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
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
    lineHeight: "1.5",
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
