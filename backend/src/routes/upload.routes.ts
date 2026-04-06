import { FastifyInstance } from "fastify";
import { FastifyRequest, FastifyReply } from "fastify";
import FormData from "form-data";
import axios from "axios";

interface UploadBody {
  title?: string;
}

export default async function UploadRoutes(fastify: FastifyInstance) {
    fastify.post('/upload', async (request: FastifyRequest<{ Body: UploadBody }>, reply) => {
        try {
            const file = await request.file();
            if (!file) return reply.status(400).send({ error: 'No file uploaded' });
            
            
            const formData = new FormData();
            formData.append('title', request.body?.title || 'Sin título');
            formData.append('file', file.file, { filename: file.filename });

            const n8nResponse = await axios.post(
                'https://n8n.pixelinlove.net/webhook-test/57b34d34-ec07-4b97-824b-778ec755b35a',
                formData,
                {
                    headers: formData.getHeaders(),
                    responseType: 'arraybuffer'
                }
            );

            reply
                .header('Content-Disposition', `attachment; filename="resultado.docx"`)
                .type('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                .send(n8nResponse.data);

        } catch (err) {
            console.error(err);
            reply.status(500).send({ error: 'Error enviando archivo a n8n' });
        }
    });
}