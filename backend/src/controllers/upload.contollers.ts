import { FastifyRequest, FastifyReply } from "fastify";
import FormData from "form-data";
import axios from "axios";
import type { UploadBodyType } from "../schemas/upload.schema";
import { processFileWithN8n } from "../services/n8n.service";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export const uploadFileController = async (request: FastifyRequest<{ Body: UploadBodyType }>, reply: FastifyReply) => {
    try {
        const file = await request.file();
        if (!file) return reply.status(400).send({ error: 'No file uploaded' });

        const allowedMimeTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'text/plain',
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            return reply.status(400).send({
                error: 'Invalid file type. Only PDF, DOCX, DOC, and TXT are allowed.',
            });
        }

        const n8nResponse = await processFileWithN8n({
            file,
            title: request.body?.title || 'Sin título',
        })

        reply
            .header('Content-Disposition', `attachment; filename="cuestionario.docx"`)
            .type('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            .code(200).send(n8nResponse);

    } catch (error) {
        request.log.error(error);
    
        if(axios.isAxiosError(error)){
            return reply.status(502).send({
                error: "Error al conectarnos con n8n",
                details: error.message,
            })
        }
    
        reply.status(500).send({ error: 'Error enviando archivo a n8n' });
    }
}