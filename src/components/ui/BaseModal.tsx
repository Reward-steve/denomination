import React from "react";
import { FaTimes } from "react-icons/fa";
import { useResponsive } from "../../hooks/useResponsive";

// 1. Define the possible sizes
type ModalSize = "sm" | "md" | "lg";

// 2. Update the interface to include the optional size prop
interface iBaseModal {
  children: React.ReactNode;
  title?: string;
  setClose: (b: boolean) => void | null;
  isOpen?: boolean;
  size?: ModalSize; // Optional size property
}

// 3. Define the size map for desktop max-width
const desktopSizeMap: Record<ModalSize, string> = {
  sm: "max-w-xl", // ~500px
  md: "max-w-3xl", // ~768px (Default)
  lg: "max-w-5xl", // ~1024px
};

export const BaseModal = ({
  children,
  title = "",
  setClose,
  isOpen = true,
  size = "md", // Set 'md' as the default size
}: iBaseModal) => {
  const { isMobile } = useResponsive();

  if (!isOpen) return null;
  const desktopWidthClass = desktopSizeMap[size] || desktopSizeMap["md"];

  const contentClassName = isMobile
    ? "bg-surface rounded-t-3xl w-full h-full shadow-2xl relative animate-slide-up"
    : `bg-surface rounded-2xl w-[90%] ${desktopWidthClass} shadow-2xl relative animate-fadeIn`;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={() => setClose && setClose(false)}
    >
      {/* Modal Content Container */}
      <div className={contentClassName} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 id="modal-title" className="text-lg font-semibold text-text">
            {title}
          </h2>
          <button
            onClick={() => setClose && setClose(false)}
            className="p-2 rounded-full hover:bg-accent/10 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes className="h-5 w-5 text-text-secondary" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(100vh-65px)]">
          {children}
        </div>
      </div>
    </div>
  );
};
