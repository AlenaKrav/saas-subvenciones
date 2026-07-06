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

export const loginRequest: RedirectRequest = {
    scopes: [import.meta.env.VITE_AZURE_SCOPE!]
};