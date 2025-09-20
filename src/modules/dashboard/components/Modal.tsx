import { useResponsive } from "../../../hooks/useResponsive";
import { FaTimes } from "react-icons/fa";

export const Modal = ({ children, title = "", setClose = null }: any) => {
  const { isMobile } = useResponsive();

  const className = isMobile
    ? "bg-surface rounded-t-3xl w-full h-full shadow-2xl relative"
    : "bg-surface rounded-2xl w-auto shadow-2xl relative";

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      <div className={className} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b-2 p-3 border-border">
          <h2
            id="event-modal-title"
            className="text-xl font-semibold text-text"
          >
            {title}
          </h2>
          <button
            onClick={() => setClose && setClose(false)}
            className="p-2 rounded-full hover:bg-background/70 transition-colors"
            aria-label="Close modal"
          >
            {isMobile ? (
              <div className="text-primary">Close</div>
            ) : (
              <FaTimes className="h-5 w-5 text-text-secondary" />
            )}
          </button>
        </div>

        <div className="content">{children}</div>
      </div>
    </div>
  );
};
