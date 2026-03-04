import { type FastifyInstance } from "fastify";
import { Type } from '@sinclair/typebox';
import { ConfidentialClientApplication } from '@azure/msal-node';
import { msalConfig } from "../config/msal.config";
import { authenticateMsal } from '../hooks/auth.msal.hook';

// Create a MsalClient using the main Microsoft ConfidentialClientApplication class to manage autentication with Azure AD
// It allows us to manage secrets in more secure way
const msalClient = new ConfidentialClientApplication(msalConfig);

// Reperesents URI where User will be redirected after successfull login
const REDIRECT_URI = process.env.AZURE_REDIRECT_URI!;
const SCOPES = ['api://cd57f103-8e57-4910-a0c2-2ee98cf75006/access_as_user'];

export default async function authMsalRoutes(fastify: FastifyInstance) {
    fastify.get('/login', async(request, reply) => {
        // Parameters that will be used to generate authorization/login URL
        const authCodeParams = {
            // Generate an URL to authorize this specific scopes
            scopes: SCOPES,
            redirectUri: REDIRECT_URI
        };

        try{
            const authUrl = await msalClient.getAuthCodeUrl(authCodeParams);
            return reply.send({
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
    });

    // This routes is where the user will be redirected in case of successfull login
    // This URL will contain a temporary code
    fastify.get<{Querystring: {code: string}}>('/callback', {
        schema: {
            querystring: Type.Object({
                code: Type.String()
            })
        }
    }, async(request, reply) => {
        // Obtain the temporary code to exchange it with a token
        const {code} = request.query;
        console.log(code);

        // Create an Object with specific parameters for token exchange
        // These parameters will be verified by Microsoft in order to give us a token
        const tokenRequest = {
            code,
            scopes: SCOPES,
            redirectUri: REDIRECT_URI,
        };

        // Verify the temporary code, scopes and redirect URL and excange it for a token
        const response =  await msalClient.acquireTokenByCode(tokenRequest);

        if(!response){
            return reply.code(400).send({
                    success: false,
                    error: 'Failed to acquire token'
                });
        }
         return reply.send({
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
    });

    // Protected route that obtains user info and uses custom MSAL hook
    fastify.get('/me', {
        onRequest: [authenticateMsal],
        schema:{
            response:{
                200: Type.Object({
                success: Type.Boolean(),
                data: Type.Object({
                    userId: Type.String(),
                    email: Type.String(),
                    name:Type.Optional(Type.String())
                })
            })}
        }
    }, async(request, reply) => {
        return reply.send({
            success: true,
            data: request.user
        })
    })
}
