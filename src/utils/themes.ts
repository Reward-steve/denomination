// src/types/emotion.d.ts
import "@emotion/react"; // Required to augment Emotion's types
import type { Theme } from "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      dashboard: string;
      text: string;
      black: string;
      subText: string;
      gray: string;
      [key: string]: string; // Allow for additional colors
    };
    typography: {
      fontFamily: string;
      fontSizeBase: string;
      headingColor: string;
      bodyColor: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    // Add more categories as needed (e.g., breakpoints, borders, shadows)
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
    };
  }
}

export const lightTheme: Theme = {
  colors: {
    primary: "#3F83F8", //base-color (blue)
    secondary: "#364261", // text-colour
    subText: "#848A98", // sub-text-colour
    gray: "#667085", //Gray-500
    borderColor: "#E5E5E5", //line-color
    black: "#111928", // my-black
    dashboard: "#f8f8ff", // white
    background: "#ffffff", // white
    white: "#ffffff", // white
    text: "#111928", // my-black
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSizeBase: "14px",
    headingColor: "#111928",
    bodyColor: "#364261",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  breakpoints: {
    sm: "600px",
    md: "960px",
    lg: "1280px",
  },
};

// Dark theme definition
export const darkTheme: Theme = {
  colors: {
    primary: "#6389f4", // A slightly lighter blue for better contrast on a dark background
    secondary: "#D1D5DB", // Light gray for main text
    subText: "#9CA3AF", // Medium gray for subtext
    gray: "#6B7280", // A utility gray for various elements
    borderColor: "#4B5563", // Dark gray for borders
    black: "#E5E7EB", // A light gray
    dashboard: "#1F2937", //  A very dark blue-gray
    background: "#1F2937", // A very dark blue-gray
    white: "#374151", // A dark gray for elements that were white
    text: "#E5E7EB", // A light gray for main text
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSizeBase: "14px",
    headingColor: "#E5E7EB", // Light gray for headings
    bodyColor: "#D1D5DB", // Lighter gray for body text
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  breakpoints: {
    sm: "600px",
    md: "960px",
    lg: "1280px",
  },
};
