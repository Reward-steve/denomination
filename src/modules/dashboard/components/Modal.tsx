// components/ui/Modal.tsx
import { useEffect, useRef, useCallback } from "react";
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
  footer?: React.ReactNode;
}

export const Modal = ({
  isOpen,
  onClose,
  title = "",
  children,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEsc = true,
  footer,
}: ModalProps) => {
  const { isMobile } = useResponsive();
  const modalRef = useRef<HTMLDivElement>(null);

  // --- Prevent body scroll when modal is open ---
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // --- Handle ESC key ---
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, closeOnEsc, onClose]);

  // --- Focus trap ---
  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (e.key !== "Tab" || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, [isOpen, trapFocus]);

  // --- Auto-focus first element ---
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
    "fixed inset-0 z-[9999] w-screen h-screen flex bg-black/50 backdrop-blur-sm",
    isMobile ? "items-end justify-center" : "items-center justify-center",
    "animate-fade-in"
  );

  // --- Panel ---
  const panelClasses = clsx(
    "relative w-full sm:max-h-[90vh] max-h-[100vh] overflow-y-auto shadow-xl bg-surface",
    // ⬇️ Increased bottom padding (was pb-6, now pb-16 for safe scroll space)
    "px-4 sm:px-6 pb-20 sm:pb-12 h-full md:h-auto",
    isMobile
      ? "rounded-t-3xl animate-slide-up"
      : `rounded-2xl ${sizeClass} animate-zoom-in`
  );

  if (!isOpen) return null;

  return (
    <div
      className={overlayClasses}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        ref={modalRef}
        className={panelClasses}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface p-4">
          <h2
            id="modal-title"
            className="text-lg sm:text-xl font-semibold text-text truncate"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full hover:bg-background transition-colors bg-background"
          >
            <FaX size={14} className="text-accent" />
          </button>
        </header>

        {/* Body */}
        <div className="space-y-5 mt-4">{children}</div>

        {/* Footer (optional) */}
        {footer && (
          <footer className="mt-8 border-t border-border pt-4 flex justify-end gap-3">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
};

export default Modal;
