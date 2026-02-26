import fastify, { type FastifyInstance } from "fastify";
import { RegisterSchema, RegisterSchemaType, LoginSchema, LoginSchemaType, FailAuthResponseSchema, SuccessAuthResponseSchemaType, SuccessAuthResponseSchema, JWTPayloadSchema } from "../schemas/auth.schema";
import { registerHandler, loginHandler, meHandler } from "../controllers/auth.controllers";
import { authenticate } from "../hooks/auth.hook";

export default async function AuthRoutes (fastify: FastifyInstance){
    fastify.post<{Body: RegisterSchemaType, Reply: SuccessAuthResponseSchemaType}>('/register', {
        schema: {
            body: RegisterSchema,
            response: {
                201: SuccessAuthResponseSchema,
                401: FailAuthResponseSchema
            }
        }
    }, registerHandler);


    fastify.post<{Body: LoginSchemaType, Reply: SuccessAuthResponseSchemaType}>('/login', {
        schema:{
            body: LoginSchema,
            response: {
                200: SuccessAuthResponseSchema,
                401: FailAuthResponseSchema
            }
        }
    }, loginHandler);


    fastify.get('/me', {
        onRequest: [authenticate], 
        schema: {
            response: {
                200: JWTPayloadSchema,
                401: FailAuthResponseSchema
            }
        }
    }, meHandler)
}