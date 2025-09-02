// src/types/emotion.d.ts
import "@emotion/react";
import type { Theme } from "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      dashboard: string;
      text: string;
      subText: string;
      gray: string;
      [key: string]: string;
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
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
    };
  }
}

// Worship Soothing Light Theme
export const lightTheme: Theme = {
  colors: {
    primary: "#FF7900", // soft golden (faith/hope highlight)
    secondary: "#2563EB", // gentle blue (trust/peace)
    subText: "#6B7280", // muted gray
    gray: "#9CA3AF", // neutral utility
    borderColor: "#E5E7EB", // light gray border
    dashboard: "#F9FAFB", // soft off-white background
    background: "#FFFFFF", // clean white canvas
    text: "#1F2937", // dark slate gray for readability
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSizeBase: "15px",
    headingColor: "#111827", // slightly darker for emphasis
    bodyColor: "#374151", // calm deep gray
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

// Worship Soothing Dark Theme
export const darkTheme: Theme = {
  colors: {
    primary: "#FACC15", // glowing warm gold
    secondary: "#60A5FA", // softer sky blue
    subText: "#9CA3AF", // muted gray
    gray: "#6B7280", // utility gray
    borderColor: "#374151", // subtle border
    dashboard: "#111827", // deep slate background
    background: "#1F2937", // dark calming tone
    text: "#F3F4F6", // soft near-white text
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSizeBase: "15px",
    headingColor: "#F9FAFB", // brighter for headers
    bodyColor: "#D1D5DB", // soft light gray body
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
