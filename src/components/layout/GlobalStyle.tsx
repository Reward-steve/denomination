import { Global, css, useTheme } from "@emotion/react";

const GlobalStyles = () => {
  const theme = useTheme();

  return (
    <Global
      styles={css`
        :root {
          --color-primary: ${theme.colors.primary};
          --color-secondary: ${theme.colors.secondary};
          --color-subText: ${theme.colors.subText};
          --color-borderColor: ${theme.colors.borderColor};
          --color-dashboard: ${theme.colors.dashboard};
          --color-background: ${theme.colors.background};
          --color-white: ${theme.colors.white};
          --color-text: ${theme.colors.text};
          --color-headingColor: ${theme.typography.headingColor};
        }
        body {
          font-family: ${theme.typography.fontFamily};
          font-size: ${theme.typography.fontSizeBase};
          background-color: var(--color-background);
          color: var(--color-text);
        }
      `}
    />
  );
};

export default GlobalStyles;
