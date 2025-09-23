import { useState, useRef } from "react";
import ReactDOM from "react-dom";
import {
  FaEye,
  FaTrash,
  FaFileAlt,
  FaMusic,
  FaMicrophone,
} from "react-icons/fa";
import { Button } from "../../../components/ui/Button";
import Modal from "./Modal";
import type { MediaResponse } from "../types";
import clsx from "clsx";

interface MediaCardProps {
  item: MediaResponse;
  baseUrl?: string;
  onDelete?: (id: number) => void;
}

export const MediaCard = ({ item, baseUrl = "", onDelete }: MediaCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const createdDate = item?.created_at
    ? new Date(item.created_at).toLocaleDateString()
    : "Unknown";

  // Handle download
  const handleDownload = (path: string) => {
    const url = `${baseUrl}/${path}`;
    const filename = path.split("/").pop() || "file";
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Type-specific icon
  const getTypeIcon = () => {
    switch (item.type) {
      case "document":
        return <FaFileAlt className="h-7 w-7 text-accent" />;
      case "song":
        return <FaMusic className="h-7 w-7 text-accent" />;
      case "sermon":
        return <FaMicrophone className="h-7 w-7 text-accent" />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Card */}
      <article
        className={clsx(
          "p-4 sm:p-5 rounded-2xl bg-surface border border-border group",
          "hover:border-accent hover:shadow-lg transition-all duration-200",
          "cursor-pointer flex items-center gap-4"
        )}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex-shrink-0 p-3 rounded-xl bg-db-surface/70 group-hover:bg-db-surface">
          {getTypeIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className="text-base sm:text-lg font-semibold text-text line-clamp-1"
            title={item.name}
          >
            {item.name}
          </h3>
          <p className="text-sm text-text-secondary truncate">
            Uploaded by {item.uploaded_by} • {createdDate}
          </p>
        </div>

        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            aria-label={`Delete ${item.name}`}
          >
            <FaTrash className="w-4 h-4 text-error" />
          </Button>
        )}
      </article>

      {/* Detail Modal */}
      {ReactDOM.createPortal(
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          title={item.name}
          size="lg"
        >
          {item.type === "document" && (
            <div className="space-y-3">
              {item.paths.map((path, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg px-3 py-2 bg-db-surface/60 hover:bg-db-surface"
                >
                  <span
                    className="flex items-center gap-2 text-sm text-text truncate"
                    title={path.split("/").pop()}
                  >
                    {getTypeIcon()}
                    {`Doc ${i + 1 * 1}`}
                  </span>
                  <div className="flex gap-2">
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewFile(`${baseUrl}/${path}`)}
                    >
                      <FaEye className="h-4 w-4" />
                    </Button> */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(path)}
                    >
                      <FaEye className="h-4 w-4 text-accent" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {item.type === "song" && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm font-medium text-text mt-2">{item.name}</p>
              <audio
                ref={audioRef}
                src={`${baseUrl}/${item.paths[0]}`}
                controls
                className="w-full max-w-md rounded-lg"
              />
            </div>
          )}

          {item.type === "sermon" && (
            <div className="flex justify-center items-center w-full h-full">
              <div className="space-y-3">
                <p className="text-sm font-medium text-text mt-2">
                  {item.descr || "No description provided."}
                </p>
                <video
                  ref={videoRef}
                  src={`${baseUrl}/${item.paths[0]}`}
                  controls
                  className="w-full max-w-lg rounded-lg"
                />
              </div>
            </div>
          )}
        </Modal>,
        window.document.body
      )}

      {/* Preview Modal for documents */}
      {previewFile &&
        ReactDOM.createPortal(
          <Modal
            isOpen={!!previewFile}
            onClose={() => setPreviewFile(null)}
            title="Document Preview"
            size="xl"
          >
            <div className="relative w-full h-[70vh] sm:h-[80vh]">
              <iframe
                src={previewFile}
                className="w-full h-full rounded-lg border border-border"
                title="Document Preview"
              />
            </div>
          </Modal>,
          window.document.body
        )}
    </>
  );
};
