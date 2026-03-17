// Defines main configuration of MSAL Browser for our React App
import { type Configuration, type RedirectRequest } from "@azure/msal-browser";

export const msalConfig: Configuration = {
    auth: {
        clientId: import.meta.env.VITE_AZURE_CLIENT_ID!,
        authority: import.meta.env.VITE_AZURE_AUTHORITY!,
        redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI!,
        knownAuthorities: [
            `${import.meta.env.VITE_AZURE_TENANT_SUBDOMAIN}.ciamlogin.com`
        ]
    },
    cache: {
        cacheLocation: "localStorage",
    }
};

// Define scopes that will be required
export const loginRequest: RedirectRequest = {
    scopes: [import.meta.env.VITE_AZURE_SCOPE!]
};