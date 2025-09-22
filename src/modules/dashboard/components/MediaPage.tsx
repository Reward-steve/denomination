// src/features/dashboard/pages/MediaPage.tsx
import { useState } from "react";
import ReactDOM from "react-dom";
import DashboardLayout from "./Layout";
import { UploadModal } from "./UploadModal";
import { EmptyState } from "../../../components/ui/EmptyState";
import { useMedia } from "../hook/useMedia";
import { MediaCard } from "./MediaCard";
import { DashboardHeader } from "./Header";
import { FaFileAlt } from "react-icons/fa";
import { FaMicrophone, FaMusic } from "react-icons/fa6";

interface MediaPageProps {
  type: "document" | "song" | "sermon";
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "document":
      return <FaFileAlt className="w-20 h-20 text-primary/70" />;
    case "song":
      return <FaMusic className="w-20 h-20 text-primary/70" />;
    case "sermon":
      return <FaMicrophone className="w-20 h-20 text-primary/70" />;
    default:
      return null;
  }
};

export function MediaPage({ type }: MediaPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { documents = [], loading, error, deleteDocument } = useMedia(type);

  const baseUrl = `${import.meta.env.VITE_BASE_URL.split("/api/")[0]}`;

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <DashboardLayout>
      <DashboardHeader
        title={`${type}s`}
        description={`Securely store, manage, and access your ${type}s anytime.`}
        actionLabel={`+ New ${type}`}
        onAction={() => setIsModalOpen(true)}
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse h-44 rounded-xl bg-surface flex flex-col items-center justify-center space-y-2"
            >
              <div className="h-8 w-8 rounded bg-border" />
              <div className="h-4 w-24 rounded bg-border" />
              <div className="h-3 w-16 rounded bg-surface" />
            </div>
          ))
        ) : error ? (
          <p className="text-red-500 mt-2">⚠ Failed to load {type}s.</p>
        ) : documents.length === 0 ? (
          <EmptyState
            title={`No ${type}s Yet`}
            description={`Start by uploading your first ${type}. Your files will appear here for quick access.`}
            icon={getTypeIcon(type)}
            actionLabel={`Upload ${type}`}
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <MediaCard
                key={doc.id}
                item={doc}
                baseUrl={baseUrl}
                onDelete={deleteDocument}
              />
            ))}
          </div>
        )}

        {isModalOpen &&
          ReactDOM.createPortal(
            <UploadModal
              type={type}
              isOpen={isModalOpen}
              onClose={() => handleCloseModal()}
            />,
            window.document.body
          )}
      </DashboardHeader>
    </DashboardLayout>
  );
}
