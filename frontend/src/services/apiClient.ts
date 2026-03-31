// Centralised api client with implemented interceptors
import axios from "axios";
import { PublicClientApplication } from "@azure/msal-browser";
import { loginRequest } from "../config/msalConfig";

// Configure our custom axios instance
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000
});

// Configure interecpetors for our custom axios instance
export const setupInterceptors = (msalInstance: PublicClientApplication) => {
    // Define request interceptor to include token
    apiClient.interceptors.request.use(
        // 1º callback function that receives config object
        async (config) => {
            try {
                const account = msalInstance.getActiveAccount();
                if (account) {
                    const tokenResponse = await msalInstance.acquireTokenSilent({
                        ...loginRequest,
                        account: account
                    });
                    // Modify config object including header
                    config.headers.Authorization = `Bearer ${tokenResponse.accessToken}`;
                }
            } catch (error) {
                console.log('Error getting token', error);
            }
            // ALWAYS return config, if not the request will fail
            return config;
        },
        // 2º Here we spread errors that were not captured in the 1º callback function
        (error) => {
            return Promise.reject(error)
        }
    );

    // Define response interceptor to control errors
    apiClient.interceptors.response.use(
        // 1º callback for successfull responses, here we return raw server response without modifying it
        (response) => response,
        // 2º callback in case server responded with errors 400+
        async(error) => {
            const status = error.response ? error.response.status : null
            if(status === 401) {
                console.log('Invalid or expired token', error.response, error.response.status);
                // await msalInstance.loginRedirect(loginRequest); //If something fails with this redirect is more complicated check error in console
            }
            return Promise.reject(error);
        }
    );
};

export default apiClient;

