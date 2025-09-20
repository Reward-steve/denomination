import { useState, useRef } from "react";
import { Button } from "../../../../components/ui/Button";
import { DocumentUploadModal } from "../../components/DocumentUploadModal";
import type { DocumentFile } from "../../types";
import DashboardLayout from "../../components/Layout";

const Document = ({ type = "document" }) => {
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleAddFile = (newFile: DocumentFile) => {
    setFiles((prev) => [...prev, newFile]);
  };

  return (
    <DashboardLayout>
      {" "}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold capitalize">
            {type}
          </h1>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsModalOpen(true)}
          >
            Add New {type}
          </Button>
        </div>

        {/* Files Table */}
        {files.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            No {type}s uploaded yet. Click "Add New" to get started.
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Size</th>
                  <th className="text-left px-4 py-3">Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, idx) => (
                  <tr key={idx} className="border-b border-border">
                    <td className="px-4 py-3">{file.name}</td>
                    <td className="px-4 py-3">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </td>
                    <td className="px-4 py-3">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <DocumentUploadModal
            modalRef={modalRef}
            closeModal={() => setIsModalOpen(false)}
            handleAddFile={handleAddFile}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Document;
