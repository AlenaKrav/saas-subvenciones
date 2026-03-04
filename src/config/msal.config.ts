import { Configuration } from '@azure/msal-node';

export const msalConfig: Configuration = {
    auth: {
        clientId: process.env.AZURE_CLIENT_ID!,
        authority: process.env.AZURE_AUTHORITY,
        clientSecret: process.env.AZURE_CLIENT_SECRET
    }
};