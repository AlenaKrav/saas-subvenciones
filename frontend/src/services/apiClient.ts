// Centralised api client with implemented interceptors
import axios from "axios";
import { PublicClientApplication } from "@azure/msal-browser";
import { loginRequest } from "../config/msalConfig";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000
});


export const setupInterceptors = (msalInstance: PublicClientApplication) => {
    apiClient.interceptors.request.use(
        async (config) => {
            try {
                const account = msalInstance.getActiveAccount();
                if (account) {
                    const tokenResponse = await msalInstance.acquireTokenSilent({
                        ...loginRequest,
                        account: account
                    });
                    config.headers.Authorization = `Bearer ${tokenResponse.accessToken}`;
                }
            } catch (error) {
                console.log('Error getting token', error);
            }
            return config;
        },
        (error) => {
            return Promise.reject(error)
        }
    );

    apiClient.interceptors.response.use(
        (response) => response,
        async (error) => {
            const status = error.response ? error.response.status : null
            if (status === 401) {
                console.log('Invalid or expired token', error.response, error.response.status);
            }
            return Promise.reject(error);
        }
    );
};

export default apiClient;

