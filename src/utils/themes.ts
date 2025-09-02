// src/types/emotion.d.ts
import "@emotion/react";
import type { Theme } from "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      textSecondary: string;
      textPlaceholder: string;
      background: string;
      surface: string;
      border: string;
      neutral: string;
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
    accent: "#10B981", // Calming green for success states
    text: "#1F2937", // Readable dark gray
    textSecondary: "#4B5563", // Muted text for less important info
    textPlaceholder: "#9CA3AF", // Light gray for form placeholders
    background: "#F9FAFB", // Soft off-white background
    surface: "#FFFFFF", // Clean white for cards and elements
    border: "#E5E7EB", // Subtle dividers and borders
    neutral: "#D1D5DB", // General neutral gray
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
    primary: "#818cf8", // Lighter primary for contrast
    secondary: "#FCD34D", // Glowing secondary
    accent: "#34D399", // Calming green
    text: "#E5E7EB", // Gentle off-white
    textSecondary: "#9CA3AF", // Muted text
    textPlaceholder: "#4B5563", // Darker placeholder text
    background: "#111827", // Deep navy for less eye strain
    surface: "#1F2937", // Dark gray for cards and elements
    border: "#374151", // Soft borders
    neutral: "#4B5563", // General neutral gray
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
