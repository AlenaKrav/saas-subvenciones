import { ConfidentialClientApplication } from '@azure/msal-node';
import { msalConfig } from "../config/msal.config";
import { FastifyRequest, FastifyReply } from "fastify";
import { CallBackQuerySchemaType } from "../schemas/auth.schema";
import { getMsalUser, createMsalUser } from "../services/user.service";

// Create a MsalClient using the main Microsoft ConfidentialClientApplication class to manage autentication with Azure AD
// It allows us to manage secrets in more secure way
const msalClient = new ConfidentialClientApplication(msalConfig);

// Reperesents URI where User will be redirected after successfull login
const REDIRECT_URI = process.env.AZURE_REDIRECT_URI!;
// Our custom scope that is requiered to create tokens and verify Microsoft tokens
const SCOPES = [process.env.AZURE_SCOPE!];

export const msalLoginHandler = async (_request: FastifyRequest, reply: FastifyReply) => {
    // Parameters that will be used to generate authorization/login URL
    const authCodeParams = {
        // Generate an URL to authorize this specific scopes
        scopes: SCOPES,
        redirectUri: REDIRECT_URI
    };

    try {
        const authUrl = await msalClient.getAuthCodeUrl(authCodeParams);
        return reply.code(200).send({
            success: true,
            data: {
                loginUrl: authUrl,
                message: 'Open this url to login'
            }
        })
    }
    catch (error) {
        return reply.code(500).send({
            success: false,
            error: 'Error generating login URL'
        });
    }
};


export const msalCallbackHandler = async (request: FastifyRequest<{ Querystring: CallBackQuerySchemaType }>, reply: FastifyReply) => {
    // Obtain the temporary code to exchange it with a token
    const { code } = request.query;
    console.log(code);

    // Create an Object with specific parameters for token exchange
    // These parameters will be verified by Microsoft in order to give us a token
    const tokenRequest = {
        code,
        scopes: SCOPES,
        redirectUri: REDIRECT_URI,
    };

    // Verify the temporary code, scopes and redirect URL and excange it for a token
    const response = await msalClient.acquireTokenByCode(tokenRequest);


    if (!response) {
        return reply.code(400).send({
            success: false,
            error: 'Failed to acquire token'
        });
    }
    return reply.code(200).send({
        success: true,
        data: {
            token: response.accessToken,
            expiresOn: response.expiresOn,
            scope: response.scopes,
            user: {
                id: response.account?.homeAccountId,
                email: response.account?.username,
                name: response.account?.name
            }
        }
    });
};

export const msalMeHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const{userId, name, email} = request.user;
    let user = await getMsalUser(userId);

    if(!user) {
        user = await createMsalUser(userId, name, email);
    }

    return reply.code(200).send({
        success: true,
        data: request.user
    });
};
