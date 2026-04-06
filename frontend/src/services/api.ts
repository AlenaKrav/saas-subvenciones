// Centralized API calls = Router
import apiClient from "./apiClient";

export function getMe(){
    return apiClient.get('/auth/msal/me')
};

export function getProducts(){
    return apiClient.get('/products');
};

export async function uploadFile(formData: FormData) {
  return apiClient.post('api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'blob',
    timeout: 120000
  });
}