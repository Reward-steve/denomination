import { FaTimes } from "react-icons/fa";
import { useResponsive } from "../../hooks/useResponsive";

interface iBaseModal {
  children: React.ReactNode;
  title?: string;
  setClose: (b: boolean) => void | null;
  isOpen?: boolean;
}

export const BaseModal = ({
  children,
  title = "",
  setClose,
  isOpen = true,
}: iBaseModal) => {
  const { isMobile } = useResponsive();

  if (!isOpen) return null;

  const className = isMobile
    ? "bg-surface rounded-t-3xl w-full h-full shadow-2xl relative"
    : "bg-surface rounded-2xl w-[90%] max-w-3xl shadow-2xl relative";

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
      onClick={() => setClose && setClose(false)}
    >
      <div className={className} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2
            id="event-modal-title"
            className="text-lg font-semibold text-text"
          >
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

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[70vh]">{children}</div>
      </div>
    </div>
  );
};
