// components/DocumentCard.tsx
import {
  FaDownload,
  FaFileAlt,
  FaFilePdf,
  FaFileImage,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import { Button } from "../../../../../components/ui/Button";
import type { DocumentResponse } from "../../../types";
import { useState } from "react";
import Modal from "../../../components/Modal";

interface DocumentCardProps {
  document: DocumentResponse;
  baseUrl?: string;
  onDelete?: (id: number) => void;
}

export const DocumentCard = ({
  document,
  baseUrl = "",
  onDelete,
}: DocumentCardProps) => {
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const createdDate = new Date(document.created_at).toLocaleDateString();
  const paths = Array.isArray(document.paths) ? document.paths : [];

  const handlePreview = (path: string) => {
    setPreviewFile(`${baseUrl}/${path}`);
  };

  const handleDownload = (path: string) => {
    const link = document.createElement("a");
    link.href = `${baseUrl}/${path}`;
    link.download = path.split("/").pop() || document.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderFileIcon = (path: string) => {
    if (path.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return <FaFileImage className="text-blue-500 w-6 h-6" />;
    }
    if (path.match(/\.pdf$/i)) {
      return <FaFilePdf className="text-red-500 w-6 h-6" />;
    }
    return <FaFileAlt className="text-gray-500 w-6 h-6" />;
  };

  return (
    <>
      <article className="p-5 rounded-2xl bg-surface border border-border hover:border-accent transition duration-200 space-y-4 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3">
          <FaFileAlt className="text-accent w-6 h-6" />
          <h3 className="text-lg font-bold text-text truncate">
            {document.name}
          </h3>
        </div>

        {/* Details */}
        <div className="text-sm text-text-secondary space-y-1">
          <p>Uploaded by: {document.uploaded_by}</p>
          <p>Date: {createdDate}</p>
          <p>Files: {paths.length}</p>
        </div>

        {/* File list */}
        <div className="space-y-2">
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

        {/* Delete Button */}
        {onDelete && (
          <div className="flex justify-end">
            <Button
              variant="danger"
              size="sm"
              textSize="xs"
              onClick={() => onDelete(document.id)}
            >
              <FaTrash className="w-4 h-4" />
            </Button>
          </div>
        )}
      </article>

      {/* Preview Modal */}
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
