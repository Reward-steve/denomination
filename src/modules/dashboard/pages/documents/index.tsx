import { useState, useCallback, useMemo } from "react";
import { Button } from "../../../../components/ui/Button";
import DashboardLayout from "../../components/Layout";
import { DocumentUploadModal } from "./components/DocumentUploadModal";
import type { DocumentFile } from "../../types";
import { EmptyState } from "../../../../components/ui/EmptyState";
import { FaRegFolderOpen } from "react-icons/fa6";

/** ---------- Skeleton Loader ---------- */
const DocumentSkeleton = () => (
  <tr className="animate-pulse border-b border-border">
    <td className="px-4 py-3">
      <div className="h-4 bg-surface rounded w-2/3" />
    </td>
    <td className="px-4 py-3">
      <div className="h-4 bg-surface rounded w-1/3" />
    </td>
    <td className="px-4 py-3">
      <div className="h-4 bg-surface rounded w-1/2" />
    </td>
  </tr>
);

const Document = ({ type = "document" }) => {
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /** ---------- Handlers ---------- */
  const handleAddFile = useCallback((newFile: DocumentFile) => {
    setFiles((prev) => [...prev, newFile]);
  }, []);

  const handleCloseModal = useCallback(() => {
    setLoading(false);
    setIsModalOpen(false);
  }, []);

  /** ---------- Memoized Rows ---------- */
  const renderedFiles = useMemo(
    () =>
      files.map((file, idx) => (
        <tr
          key={idx}
          className="border-b border-border hover:bg-muted/40 transition-colors"
        >
          <td className="px-4 py-3 font-medium text-text">{file.name}</td>
          <td className="px-4 py-3 text-text-placeholder">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </td>
          <td className="px-4 py-3 text-text-placeholder">
            {new Date(file.uploadedAt).toLocaleDateString()}
          </td>
        </tr>
      )),
    [files]
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ---------- Header ---------- */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl text-text font-bold capitalize">
              {type}s
            </h1>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsModalOpen(true)}
              className="shadow-lg hover:shadow-xl transition-all"
            >
              + New {type}
            </Button>
          </div>

          {/* Small Intro for UX */}
          <p className="text-text-placeholder text-sm sm:text-base max-w-2xl">
            Securely store, manage, and access your files anytime.
          </p>
        </div>

        {/* ---------- Files Section ---------- */}
        <div className="overflow-hidden">
          {loading ? (
            <table className="w-full text-sm sm:text-base">
              <tbody>
                {Array.from({ length: 3 }).map((_, i) => (
                  <DocumentSkeleton key={i} />
                ))}
              </tbody>
            </table>
          ) : files.length === 0 ? (
            <EmptyState
              title={`No ${type}s Yet`}
              description={`Start by uploading your first ${type}. All your files will be listed here for quick access.`}
              icon={<FaRegFolderOpen className="w-20 h-20 text-primary/70" />}
              actionLabel={`Upload ${type}`}
              onAction={() => setIsModalOpen(true)}
            />
          ) : (
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-text">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-text">
                    Size
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-text">
                    Uploaded
                  </th>
                </tr>
              </thead>
              <tbody>{renderedFiles}</tbody>
            </table>
          )}
        </div>

        {/* ---------- Upload Modal ---------- */}
        {isModalOpen && (
          <DocumentUploadModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            handleAddFile={handleAddFile}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Document;
