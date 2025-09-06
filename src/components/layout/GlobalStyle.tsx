import { Global, css, useTheme } from "@emotion/react";

const GlobalStyles = () => {
  const theme = useTheme();

  return (
    <Global
      styles={css`
        :root {
          /* Colors */
          --color-primary: ${theme.colors.primary};
          --color-secondary: ${theme.colors.secondary};
          --color-accent: ${theme.colors.accent};
          --color-text: ${theme.colors.text};
          --color-text-secondary: ${theme.colors.textSecondary};
          --color-text-placeholder: ${theme.colors.textPlaceholder};
          --color-background: ${theme.colors.background};
          --color-surface: ${theme.colors.surface};
          --color-border: ${theme.colors.border};
          --color-neutral: ${theme.colors.neutral};
        }

        body {
          font-family: ${theme.typography.fontFamily};
          font-size: ${theme.typography.fontSize.base};
          line-height: ${theme.typography.lineHeight};
          background-color: var(--color-background);
          color: var(--color-text);
          margin: 0;
          padding: 0;
        }
      `}
    />
  );
};

export default GlobalStyles;
