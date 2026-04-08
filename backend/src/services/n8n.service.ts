import FormData from "form-data";
import axios from "axios";
import type { MultipartFile } from '@fastify/multipart';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export interface ProcessFileOptions {
    file: MultipartFile;
    title: string;
}

export async function processFileWithN8n(options: ProcessFileOptions): Promise<Buffer> {
    const { file, title } = options;

    const formData = new FormData();
    formData.append('title', title || 'Sin título');
    formData.append('file', file.file, {
        filename: file.filename,
        contentType: file.mimetype,
    });

    const response = await axios.post(
        N8N_WEBHOOK_URL,
        formData,
        {
            headers: formData.getHeaders(),
            responseType: 'arraybuffer',
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }), //helpful to continue making requests in case of sert problems in 8n8
        }
    );

    return Buffer.from(response.data)

}