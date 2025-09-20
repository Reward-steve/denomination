import { fetcher } from "../../../services";
import { apiRequest } from "../../../services/apiResquest";
import type { DocumentFile } from "../types";

// Create a new Document
export const createDocument = async (document: DocumentFile) => {
  return apiRequest("docs/info/create", "POST", document);
};

// Upload a single Document by
export const fileUpload = async (documentId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("id", documentId.toString());

  return apiRequest("file/upload", "POST", formData); // true for multipart
};

// Update an existing Document by ID
export const updateDocument = async (
  documentId: number,
  document: DocumentFile
) => {
  // Use template literals correctly
  return apiRequest(`docs/${documentId}/update`, "PUT", document);
};

// Delete an Document by ID
export const deleteDocument = async (documentId: number) => {
  return apiRequest(`docs/${documentId}/del`, "DELETE");
};

// Fetch all Documents
// Correct async function with return type
export const fetchAllDocuments = async (): Promise<{
  success: boolean;
  message: string;
  data: DocumentFile[];
}> => {
  return fetcher("docs/fetch");
};
