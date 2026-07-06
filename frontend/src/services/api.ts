// Centralized API calls = Router
import apiClient from "./apiClient";

export async function uploadFile(formData: FormData) {
  return apiClient.post('api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'blob',
    timeout: 120000
  });
}