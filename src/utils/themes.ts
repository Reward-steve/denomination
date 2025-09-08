// src/types/emotion.d.ts
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
    primary: "#6366F1", // Spiritual and calming blue
    secondary: "#FACC15", // Hopeful yellow
    accent: "#10B981",
    accentLight: "#10B98140",
    text: "#1F2937", // Readable dark gray
    textSecondary: "#4B5563", // Muted text for less important info
    textPlaceholder: "#9CA3AF", // Light gray for form placeholders
    background: "#F9FAFB", // Soft off-white background
    surface: "#FFFFFF", // Clean white for cards and elements
    border: "#E5E7EB", // Subtle dividers and borders
    neutral: "#D1D5DB", // General neutral gray
    error: "#e3342f",
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

// 🌙 Modern & Serene Dark Theme
export const darkTheme: Theme = {
  colors: {
    primary: "#6366F1", // Spiritual and calming blue
    secondary: "#FACC15", // Hopeful yellow
    accent: "#10B981",
    accentLight: "#10B98140",
    text: "#1F2937", // Readable dark gray
    textSecondary: "#4B5563", // Muted text for less important info
    textPlaceholder: "#9CA3AF", // Light gray for form placeholders
    background: "#F9FAFB", // Soft off-white background
    surface: "#FFFFFF", // Clean white for cards and elements
    border: "#E5E7EB", // Subtle dividers and borders
    neutral: "#D1D5DB", // General neutral gray
    error: "#e3342f",
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
