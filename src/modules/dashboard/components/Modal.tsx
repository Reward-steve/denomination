// components/ui/Modal.tsx
import { useEffect, useRef } from "react";
import clsx from "clsx";
import { FaX } from "react-icons/fa6";
import { useResponsive } from "../../../hooks/useResponsive";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title = "",
  children,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEsc = true,
}: ModalProps) => {
  const { isMobile } = useResponsive();
  const modalRef = useRef<HTMLDivElement>(null);

  // --- Lock body scroll when open ---
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // --- Escape key handling ---
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, closeOnEsc, onClose]);

  // --- Autofocus first focusable ---
  useEffect(() => {
    if (!isOpen) return;
    const el = modalRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    el?.focus();
  }, [isOpen]);

  // --- Sizes ---
  const sizeClass = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
  }[size];

  // --- Overlay ---
  const overlayClasses = clsx(
    "fixed inset-0 z-[9999] w-screen h-screen flex bg-black/50",
    isMobile ? "items-end justify-center" : "items-center justify-center",
    "animate-fade-in"
  );

  // --- Modal Panel ---
  const panelClasses = clsx(
    "relative w-full max-h-[90vh] overflow-y-auto shadow-xl bg-surface pt-0",
    "px-4 sm:px-6 pb-6",
    isMobile
      ? "rounded-t-3xl animate-slide-up"
      : `rounded-2xl ${sizeClass} animate-zoom-in`
  );

  // --- Overlay click ---
  const handleOverlayClick = () => {
    if (closeOnOverlayClick) onClose();
  };

  // --- Don’t render UI if closed ---
  if (!isOpen) return null;

  return (
    <div
      className={overlayClasses}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={panelClasses}
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Header --- */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface p-4">
          <h2
            id="modal-title"
            className="text-lg sm:text-xl font-semibold text-text top-0"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full hover:bg-background/70 transition-colors"
          >
            <FaX size={16} className="text-primary" />
          </button>
        </header>

        {/* --- Body --- */}
        <div className="space-y-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
