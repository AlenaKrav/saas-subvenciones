// Import types for TS
import fastify, { type FastifyInstance } from "fastify";
import authMsalRoutes from "./routes/auth.msal.routes";
import cors from '@fastify/cors';
import fastifyMultipart from "@fastify/multipart";
import UploadRoutes from "./routes/upload.routes";
import AiRoutes from "./routes/ai.routes";


const app: FastifyInstance = fastify({ logger: true })


app.register(cors, {
    origin: 'http://localhost:5173',
    credentials: true
});

app.register(fastifyMultipart, {
    limits: {
    fileSize: 20 * 1024 * 1024
    }
});

app.register(authMsalRoutes, { prefix: '/auth/msal' });
app.register(UploadRoutes, { prefix: '/api' });
app.register(AiRoutes);


export default app;