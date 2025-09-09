import { Global, css, useTheme } from "@emotion/react";

const GlobalStyles = () => {
  const theme = useTheme();

  return (
    <Global
      styles={css`
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
