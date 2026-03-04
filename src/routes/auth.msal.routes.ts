import { type FastifyInstance } from "fastify";
import { authenticateMsal } from '../hooks/auth.msal.hook';
import { CallBackQuerySchemaType, 
        CallBackQuerySchema, 
        MsalLoginURLSchema, 
        MsalLoginURLSchemaType,
        MsalTokenRepsonseSchema,
        MsalTokenRepsonseSchemaType,
        MsalUserResponseSchema,
        MsalUserResponseSchemaType,
        FailAuthResponseSchema } from "../schemas/auth.schema";
import { msalLoginHandler, msalCallbackHandler, msalMeHandler } from "../controllers/msal.aut.controllers";

export default async function authMsalRoutes(fastify: FastifyInstance) {
    fastify.get<{Reply: MsalLoginURLSchemaType}>('/login', {
        schema: {
            response: {
                200: MsalLoginURLSchema,
                500: FailAuthResponseSchema
            }
        }
    }, msalLoginHandler);


    // This route is where the user will be redirected in case of successfull login
    // This URL will contain a temporary code
    fastify.get<{ Querystring: CallBackQuerySchemaType, Reply: MsalTokenRepsonseSchemaType }>('/callback', {
        schema: {
            querystring: CallBackQuerySchema,
            response: {
                200: MsalTokenRepsonseSchema,
                400: FailAuthResponseSchema
            }
        }
    }, msalCallbackHandler);

    // Protected route that obtains user info and uses custom MSAL hook
    fastify.get<{Reply: MsalUserResponseSchemaType}>('/me', {
        onRequest: [authenticateMsal],
        schema: {
            response: {
                200: MsalUserResponseSchema
            }
        }
    }, msalMeHandler)
};