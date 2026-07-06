import { type FastifyInstance } from "fastify";
import { CallBackQuerySchemaType, 
        CallBackQuerySchema, 
        MsalLoginURLSchema, 
        MsalLoginURLSchemaType,
        MsalTokenRepsonseSchema,
        MsalTokenRepsonseSchemaType,
        FailAuthResponseSchema } from "../schemas/auth.schema";
import { msalLoginHandler, msalCallbackHandler } from "../controllers/msal.aut.controllers";

export default async function authMsalRoutes(fastify: FastifyInstance) {
    fastify.get<{Reply: MsalLoginURLSchemaType}>('/login', {
        schema: {
            response: {
                200: MsalLoginURLSchema,
                500: FailAuthResponseSchema
            }
        }
    }, msalLoginHandler);


    fastify.get<{ Querystring: CallBackQuerySchemaType, Reply: MsalTokenRepsonseSchemaType }>('/callback', {
        schema: {
            querystring: CallBackQuerySchema,
            response: {
                200: MsalTokenRepsonseSchema,
                400: FailAuthResponseSchema
            }
        }
    }, msalCallbackHandler);
};