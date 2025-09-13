import { useState } from "react";
import DashboardLayout from "../components/Layout";
import { Button } from "../../../components/ui/Button";
import { FaUpload, FaFileAlt, FaTrash } from "react-icons/fa";

/* -------------------- Types -------------------- */
interface DocumentFile {
  id: number;
  name: string;
  size: number;
  type: string;
}

/* -------------------- Page -------------------- */
export default function Documents() {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection
  const handleFiles = (files: FileList) => {
    const newDocs = Array.from(files).map((file, i) => ({
      id: Date.now() + i,
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setDocuments((prev) => [...prev, ...newDocs]);
  };

  // Handle drag & drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Delete document
  const handleDelete = (id: number) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <DashboardLayout>
      <section className="space-y-6 animate-fade">
        {/* Page Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text">Documents</h2>
            <p className="text-text-placeholder mt-1">
              Safely upload and manage your files in one place. You can drag &
              drop or use the upload button.
            </p>
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
            <Button variant="primary" className="gap-2">
              <FaUpload /> Upload Files
            </Button>
          </label>
        </header>

        {/* Upload Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          tabIndex={0}
          role="button"
          aria-label="Drag and drop documents here or click Upload Files"
          className={`rounded-xl p-8 border-2 border-dashed transition-colors text-center focus:outline-none focus:ring-2 focus:ring-accent ${
            dragActive
              ? "border-accent bg-accent/10"
              : "border-border hover:border-accent"
          }`}
        >
          <FaUpload className="mx-auto text-3xl text-accent mb-2" />
          <p className="text-text font-medium">
            Drag & drop your documents here, or click <b>“Upload Files”</b>{" "}
            above.
          </p>
          <p className="text-sm text-text-placeholder mt-1">
            Supported formats: <b>PDF, DOCX, PNG, JPG</b> (Max 5MB each)
          </p>
        </div>

        {/* Documents List */}
        {documents.length > 0 ? (
          <ul className="space-y-3">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-lg bg-surface shadow hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <FaFileAlt className="text-accent text-xl shrink-0" />
                  <div className="truncate">
                    <p className="font-medium text-text truncate">{doc.name}</p>
                    <p className="text-xs text-text-placeholder">
                      {(doc.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-error shrink-0"
                  onClick={() => handleDelete(doc.id)}
                  aria-label={`Delete ${doc.name}`}
                >
                  <FaTrash />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl p-6 text-center text-text-placeholder flex flex-col items-center justify-center gap-2">
            <FaFileAlt className="text-4xl opacity-50" />
            <p>No documents uploaded yet. Start by adding one.</p>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
