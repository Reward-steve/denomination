import { useState } from "react";
import ReactDOM from "react-dom";
import { Button } from "../../../../components/ui/Button";
import DashboardLayout from "../../components/Layout";
import { DocumentUploadModal } from "./components/DocumentUploadModal";
import { EmptyState } from "../../../../components/ui/EmptyState";
import { FaRegFolderOpen } from "react-icons/fa6";
import { useDocuments } from "../../hook/useDocument";
import { DocumentCard } from "./components/documentCard";

const Document = ({ type = "document" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { documents = [], loading, error, deleteDocument } = useDocuments(type);

  const baseUrl = `${import.meta.env.VITE_BASE_URL.split("/api/")[0]}`;

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sticky top-0 bg-background/80 backdrop-blur-md z-10 py-4 border-b border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text capitalize">
                {type}s
              </h1>
              <p className="text-sm text-text-placeholder">
                Securely store, manage, and access your {type}s anytime.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsModalOpen(true)}
              className="shadow-md hover:shadow-lg transition-all"
            >
              + New {type}
            </Button>
          </div>
        </div>

        {/* Files Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse h-44 rounded-xl bg-surface flex flex-col items-center justify-center space-y-2"
              >
                <div className="h-8 w-8 rounded bg-gray-300" />
                <div className="h-4 w-24 rounded bg-gray-300" />
                <div className="h-3 w-16 rounded bg-gray-200" />
              </div>
            ))
          ) : error ? (
            <p className="text-red-500">⚠ Failed to load {type}s.</p>
          ) : documents.length === 0 ? (
            <div className="flex justify-center py-16">
              <EmptyState
                title={`No ${type}s Yet`}
                description={`Start by uploading your first ${type}. Your files will appear here for quick access.`}
                icon={<FaRegFolderOpen className="w-20 h-20 text-primary/70" />}
                actionLabel={`Upload ${type}`}
                onAction={() => setIsModalOpen(true)}
              />
            </div>
          ) : (
            documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                baseUrl={baseUrl}
                onDelete={deleteDocument}
              />
            ))
          )}
        </div>

        {/* Upload Modal */}
        {isModalOpen &&
          ReactDOM.createPortal(
            <DocumentUploadModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />,
            window.document.body // ✅ explicitly use window.document
          )}
      </div>
    </DashboardLayout>
  );
};

export default Document;
