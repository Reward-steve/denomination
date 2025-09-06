import { useEffect, useState } from "react";
import { ResponsiveContext, type ResponsiveType } from "./ResponsiveContext";

export default function ResponsiveProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [responsive, setResponsive] = useState<ResponsiveType>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setResponsive({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    handleResize(); // Set on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ResponsiveContext.Provider value={responsive}>
      {children}
    </ResponsiveContext.Provider>
  );
}
