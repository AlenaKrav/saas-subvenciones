// Centralized API calls = Router
import apiClient from "./apiClient";

export function getMe(){
    return apiClient.get('/auth/msal/me')
};

export function getProducts(){
    return apiClient.get('/products');
};