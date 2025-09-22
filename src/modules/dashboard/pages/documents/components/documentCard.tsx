import {
  FaDownload,
  FaFileAlt,
  FaFilePdf,
  FaFileImage,
  FaTrash,
  FaEye,
  FaFolderOpen,
} from "react-icons/fa";
import { Button } from "../../../../../components/ui/Button";
import type { DocumentResponse } from "../../../types";
import { useState } from "react";
import Modal from "../../../components/Modal";

interface DocumentCardProps {
  document: DocumentResponse; // ✅ aligned with parent
  baseUrl?: string;
  onDelete?: (id: number) => void;
}

export const DocumentCard = ({
  document,
  baseUrl = "",
  onDelete,
}: DocumentCardProps) => {
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ defensive checks
  const createdDate = document?.created_at
    ? new Date(document.created_at).toLocaleDateString()
    : "Unknown";

  const paths = Array.isArray(document?.paths) ? document.paths : [];

  const handlePreview = (path: string) => {
    setPreviewFile(`${baseUrl}/${path}`);
  };

  const handleDownload = (path: string) => {
    if (typeof window === "undefined") return;

    const url = `${baseUrl}/${path}`;
    const filename = path.split("/").pop() || "file";

    const link = window.document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const renderFileIcon = (path: string) => {
    if (path.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return <FaFileImage className="text-blue-500 w-5 h-5" />;
    }
    if (path.match(/\.pdf$/i)) {
      return <FaFilePdf className="text-red-500 w-5 h-5" />;
    }
    return <FaFileAlt className="text-gray-500 w-5 h-5" />;
  };

  return (
    <>
      <article
        className="p-5 rounded-2xl bg-surface border border-border hover:border-accent transition duration-200 shadow-sm cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <FaFolderOpen className="text-accent w-6 h-6" />
              <h3 className="text-lg font-semibold text-text truncate">
                {document?.name || "Untitled"}
              </h3>
            </div>
            <div className="text-sm text-text-secondary space-y-1">
              <p>Uploaded by: {document?.uploaded_by || "Unknown"}</p>
              <p>Date: {createdDate}</p>
              <p>Files: {paths.length}</p>
            </div>
          </div>

          {onDelete && document?.id && (
            <Button
              variant="danger"
              size="sm"
              textSize="xs"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(document.id);
              }}
            >
              <FaTrash className="w-4 h-4" />
            </Button>
          )}
        </div>
      </article>

      {/* Files modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${document?.name || "Document"} - Files`}
        size="lg"
      >
        <div className="space-y-3">
          {paths.map((path, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-surface-secondary rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2 truncate">
                {renderFileIcon(path)}
                <span className="truncate text-sm">
                  {path.split("/").pop()}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  textSize="xs"
                  onClick={() => handlePreview(path)}
                >
                  <FaEye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  textSize="xs"
                  onClick={() => handleDownload(path)}
                >
                  <FaDownload className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* File preview modal */}
      {previewFile && (
        <Modal
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          title="File Preview"
          size="lg"
        >
          <div className="w-full h-[70vh] flex items-center justify-center bg-black/5 rounded-lg overflow-hidden">
            {previewFile.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img
                src={previewFile}
                alt="Preview"
                className="max-h-full max-w-full object-contain"
              />
            ) : previewFile.match(/\.pdf$/i) ? (
              <iframe
                src={previewFile}
                title="PDF Preview"
                className="w-full h-full border-none"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-text-secondary">
                <FaFileAlt className="w-12 h-12 mb-2 text-accent" />
                <p className="text-sm">Preview not available</p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-3"
                  onClick={() => window.open(previewFile, "_blank")}
                >
                  Open File
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};
