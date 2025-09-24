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
import { useAuth } from "../../../hooks/useAuth";

interface MediaPageProps {
  type: "document" | "song" | "sermon";
}

/* ------------------------------------------
   🔹 Icon Mapper for Media Types
------------------------------------------ */
const getTypeIcon = (type: MediaPageProps["type"]) => {
  const icons = {
    document: <FaFileAlt className="w-20 h-20 text-primary/70" />,
    song: <FaMusic className="w-20 h-20 text-primary/70" />,
    sermon: <FaMicrophone className="w-20 h-20 text-primary/70" />,
  };
  return icons[type] ?? null;
};

export function MediaPage({ type }: MediaPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { documents = [], loading, error, deleteDocument } = useMedia(type);
  const { user } = useAuth();

  const is_admin = Boolean(user?.is_admin);
  const baseUrl = `${import.meta.env.VITE_BASE_URL.split("/api/")[0]}`;

  const handleCloseModal = () => setIsModalOpen(false);

  /* ------------------------------------------
     🔹 Render States
  ------------------------------------------ */
  const renderContent = () => {
    if (loading) {
      return Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse h-44 rounded-xl bg-surface flex flex-col items-center justify-center space-y-2"
        >
          <div className="h-8 w-8 rounded bg-border" />
          <div className="h-4 w-24 rounded bg-border" />
          <div className="h-3 w-16 rounded bg-surface" />
        </div>
      ));
    }

    if (error) {
      return <p className="text-red-500 mt-2">⚠ Failed to load {type}s.</p>;
    }

    if (documents.length === 0) {
      return (
        <EmptyState
          title={`No ${type}s Yet`}
          description={
            is_admin
              ? `Start by uploading your first ${type}. Your files will appear here for quick access.`
              : `No ${type}s have been uploaded yet.`
          }
          icon={getTypeIcon(type)}
          actionLabel={is_admin ? `Upload ${type}` : undefined}
          onAction={is_admin ? () => setIsModalOpen(true) : undefined}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <MediaCard
            key={doc.id}
            item={doc}
            baseUrl={baseUrl}
            onDelete={is_admin ? deleteDocument : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title={`${type}s`}
        description={`${
          is_admin
            ? `Securely store, manage, and access your ${type}s anytime.`
            : `Easily access and explore your ${type}s whenever you need.`
        }`}
        actionLabel={is_admin ? `+ New ${type}` : undefined}
        onAction={is_admin ? () => setIsModalOpen(true) : undefined}
      >
        {renderContent()}

        {is_admin &&
          isModalOpen &&
          ReactDOM.createPortal(
            <UploadModal
              type={type}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />,
            window.document.body
          )}
      </DashboardHeader>
    </DashboardLayout>
  );
}
