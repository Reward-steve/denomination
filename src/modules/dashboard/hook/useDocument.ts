// hooks/useDocuments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDocument,
  updateDocument,
  deleteDocument,
  fetchAllDocuments,
  fileUpload,
} from "../services/document";

import type { DocumentPayload, DocumentResponse, DocumentType } from "../types";

/* -------- Response type for file upload -------- */
export interface FileUploadResponse {
  status: boolean;
  message: string;
  data: {
    path: string;
  };
}

export function useDocuments(type: DocumentType = "document") {
  const queryClient = useQueryClient();

  /* ---------------- Fetch Documents ---------------- */
  const {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchDocuments,
  } = useQuery({
    queryKey: ["documents", type],
    queryFn: () => fetchAllDocuments(type),
    staleTime: 1000 * 60,
  });

  const documents: DocumentResponse[] = data?.data ?? [];

  /* ---------------- Upload a single file ---------------- */
  const uploadFileMutation = useMutation({
    mutationFn: (file: File): Promise<FileUploadResponse> =>
      fileUpload(type, file), // ✅ pass type ("song" | "document" | "sermon")
  });

  /* ---------------- Create Document after files uploaded ---------------- */
  const createDocumentMutation = useMutation({
    mutationFn: (doc: DocumentPayload) => createDocument(doc),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", type] });
    },
  });

  /* ---------------- Update Document ---------------- */
  const updateDocumentMutation = useMutation({
    mutationFn: ({ id, doc }: { id: number; doc: DocumentPayload }) =>
      updateDocument(id, doc),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", type] });
    },
  });

  /* ---------------- Delete Document ---------------- */
  const deleteDocumentMutation = useMutation({
    mutationFn: (id: number) => deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", type] });
    },
  });

  /* ---------------- Helper: Full Upload Flow ---------------- */
  const uploadAndCreateDocument = async ({
    files,
    name,
    descr,
    visibility,
  }: {
    files: File[];
    name: string;
    descr?: string;
    visibility: "public" | "private" | "admins";
  }) => {
    try {
      // 1️⃣ Upload all files in parallel
      const uploadResults = await Promise.all(
        files.map((file) => uploadFileMutation.mutateAsync(file))
      );

      const paths = uploadResults.map((res) => res.data.path);

      // 2️⃣ Create document with collected paths
      return await createDocumentMutation.mutateAsync({
        document: paths,
        type,
        name,
        descr,
        visibility,
      });
    } catch (err) {
      console.error("Upload & create document failed:", err);
      throw err;
    }
  };

  return {
    documents,
    loading: isLoading,
    error: isError ? (error as Error).message : null,
    fetchDocuments,

    // Main actions
    uploadAndCreateDocument,
    createDocument: createDocumentMutation.mutateAsync,
    updateDocument: updateDocumentMutation.mutateAsync,
    deleteDocument: deleteDocumentMutation.mutateAsync,

    // States
    creating: createDocumentMutation.isPending,
    updating: updateDocumentMutation.isPending,
    deleting: deleteDocumentMutation.isPending,
    uploading: uploadFileMutation.isPending,
  };
}
