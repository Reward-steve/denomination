// services/document.ts
import { fetcher } from "../../../services";
import { apiRequest } from "../../../services/apiResquest";

import type { DocumentPayload, DocumentResponse, MediaType } from "../types";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/* ---------- APIs ---------- */

// Create a new Document (after file upload gives us paths)
export const createDocument = async (
  payload: DocumentPayload
): Promise<ApiResponse<DocumentResponse | null>> => {
  return apiRequest("docs/info/create", "POST", payload);
};

// Upload a single file (before creating document)
export const fileUpload = async (
  type: MediaType,
  file: File
): Promise<ApiResponse<{ path: string } | null>> => {
  const formData = new FormData();

  formData.append("document", file);
  formData.append("type", type);

  return apiRequest("file/upload", "POST", formData);
};

// Update an existing Document
export const updateDocument = async (
  documentId: number,
  payload: Partial<DocumentPayload>
): Promise<ApiResponse<DocumentResponse | null>> => {
  return apiRequest(`docs/${documentId}/update`, "PUT", payload);
};

// Delete a Document
export const deleteDocument = async (
  documentId: number
): Promise<ApiResponse<null>> => {
  return apiRequest(`docs/${documentId}/del`, "DELETE");
};

// Fetch all Documents by type
export const fetchAllDocuments = async (
  type: MediaType
): Promise<ApiResponse<DocumentResponse[]>> => {
  return fetcher(`docs/fetch?type=${type}`);
};
