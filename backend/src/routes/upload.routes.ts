import { FastifyInstance } from "fastify";
import { uploadFileController } from "../controllers/upload.contollers";
import { UploadErrorResponseSchema, UploadSuccessSchema, UploadBodyType, UploadSuccessType } from "../schemas/upload.schema";
import { authenticateMsal } from '../hooks/auth.msal.hook';


export default async function UploadRoutes(fastify: FastifyInstance) {
    fastify.post<{ Body: UploadBodyType, Reply: UploadSuccessType }>('/upload', {
        onRequest: [authenticateMsal],
        schema: {
            response: {
                200: UploadSuccessSchema,
                400: UploadErrorResponseSchema,
                500: UploadErrorResponseSchema,
                502: UploadErrorResponseSchema
            }
        }
    }, uploadFileController)
}