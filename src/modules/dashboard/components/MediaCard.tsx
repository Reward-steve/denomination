import { useState } from "react";
import ReactDOM from "react-dom";
import {
  FaTrash,
  FaFileAlt,
  FaMusic,
  FaMicrophone,
  FaFileDownload,
  FaVideo,
  FaPlay,
  FaPause,
} from "react-icons/fa";
import { Button } from "../../../components/ui/Button";
import Modal from "./Modal";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import type { MediaResponse } from "../types";
import clsx from "clsx";

interface MediaCardProps {
  item: MediaResponse;
  baseUrl?: string;
  onDelete?: (id: number) => void;
}

export const MediaCard = ({ item, baseUrl = "", onDelete }: MediaCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);

  const createdDate = item?.created_at
    ? new Date(item.created_at).toLocaleDateString()
    : "Unknown";

  const isAudioFile = (file: string) => /\.(mp3|wav|m4a|ogg)$/i.test(file);
  const isVideoFile = (file: string) => /\.(mp4|mov|avi|mkv|webm)$/i.test(file);

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

  const getTypeIcon = () => {
    switch (item.type) {
      case "document":
        return <FaFileAlt className="h-6 w-6 text-accent" />;
      case "song":
        return <FaMusic className="h-6 w-6 text-accent" />;
      case "sermon":
        return <FaMicrophone className="h-6 w-6 text-accent" />;
      default:
        return null;
    }
  };

  const togglePlay = (id: string) => {
    setCurrentPlaying((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {/* Compact Card */}
      <article
        className={clsx(
          "p-4 sm:p-5 rounded-xl bg-surface border border-border",
          "hover:border-accent hover:shadow-lg transition-all duration-200",
          "cursor-pointer flex items-start gap-4"
        )}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex-shrink-0 p-3 rounded-lg bg-db-surface/60 group-hover:bg-db-surface">
          {getTypeIcon()}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <h3
            className="text-base sm:text-lg font-semibold text-text truncate"
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
              setConfirmDelete(true);
            }}
          >
            <FaTrash className="w-4 h-4 text-error" />
          </Button>
        )}
      </article>

      {/* ✅ Reusable Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete}
        title="Confirm Delete"
        message={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{item.name}</span>? <br />
            This action cannot be undone.
          </>
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => {
          onDelete?.(item.id);
          setConfirmDelete(false);
        }}
        onCancel={() => setConfirmDelete(false)}
      />

      {/* Detail Modal */}
      {ReactDOM.createPortal(
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={item.name}
          size="lg"
        >
          <div className="space-y-4">
            {/* DOCUMENTS */}
            {item.type === "document" &&
              item.paths.map((path, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-2 rounded-lg bg-db-surface/50 hover:bg-db-surface transition"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-text truncate">
                    <FaFileAlt className="h-5 w-5 text-accent" />
                    {`Document ${i + 1}`}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(path)}
                  >
                    <FaFileDownload className="h-4 w-4" />
                  </Button>
                </div>
              ))}

            {/* SONGS */}
            {item.type === "song" &&
              item.paths.map((path, i) => {
                const id = `song-${i}`;
                const isPlaying = currentPlaying === id;

                return (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-2 rounded-lg bg-db-surface/50 hover:bg-db-surface transition"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-text truncate">
                      <FaMusic className="h-5 w-5 text-accent" />
                      {`Song ${i + 1}`}
                    </span>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePlay(id)}
                    >
                      {isPlaying ? (
                        <FaPause className="h-4 w-4" />
                      ) : (
                        <FaPlay className="h-4 w-4" />
                      )}
                    </Button>

                    {isPlaying && (
                      <audio
                        autoPlay
                        controls
                        src={`${baseUrl}/${path}`}
                        onEnded={() => setCurrentPlaying(null)}
                        className="hidden"
                      />
                    )}
                  </div>
                );
              })}

            {/* SERMONS */}
            {item.type === "sermon" && (
              <div className="flex flex-col gap-5 w-full">
                {item.descr && (
                  <p className="text-sm font-medium text-text text-center px-4">
                    {item.descr}
                  </p>
                )}
                <div className="space-y-3 w-full">
                  {item.paths.map((path, i) => {
                    const id = `sermon-${i}`;
                    const isAudio = isAudioFile(path);
                    const isVideo = isVideoFile(path);
                    const isPlaying = currentPlaying === id;

                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between px-4 py-3 rounded-lg bg-db-surface/50 hover:bg-db-surface transition"
                      >
                        <span className="flex items-center gap-2 text-sm font-medium text-text truncate">
                          {isAudio ? (
                            <FaMicrophone className="h-5 w-5 text-accent" />
                          ) : isVideo ? (
                            <FaVideo className="h-5 w-5 text-accent" />
                          ) : (
                            <FaFileAlt className="h-5 w-5 text-error" />
                          )}
                          {isAudio
                            ? `Audio Sermon ${i + 1}`
                            : isVideo
                            ? `Video Sermon ${i + 1}`
                            : `Unsupported ${i + 1}`}
                        </span>

                        {isAudio && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePlay(id)}
                          >
                            {isPlaying ? (
                              <FaPause className="h-4 w-4" />
                            ) : (
                              <FaPlay className="h-4 w-4" />
                            )}
                          </Button>
                        )}

                        {isAudio && isPlaying && (
                          <audio
                            autoPlay
                            controls
                            src={`${baseUrl}/${path}`}
                            onEnded={() => setCurrentPlaying(null)}
                            className="hidden"
                          />
                        )}
                        {isVideo && (
                          <video
                            controls
                            src={`${baseUrl}/${path}`}
                            className="w-full sm:w-96 rounded"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Modal>,
        window.document.body
      )}
    </>
  );
};
