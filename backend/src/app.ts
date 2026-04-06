// Import types for TS
import fastify, { type FastifyInstance } from "fastify";
import UserRoutes from "./routes/user.routes";
import ProductRoutes from "./routes/product.routes";
import AuthRoutes from "./routes/auth.routes";
import authMsalRoutes from "./routes/auth.msal.routes";
import { ZodTypeProvider, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import cors from '@fastify/cors'; // Specific fastify plugin than allows us to send CORS headers
import fastifyMultipart from "@fastify/multipart"; //enable our server to receive files
import UploadRoutes from "./routes/upload.routes";


// If we want to user ZOD instead of TYPEBOX we should to the following:
// 1. use type provider on App level
// 2. explicitly use its compiler, because Fastify uses AJV for validation as default option
// 3. explicitly use its serializer, because Fastify uses fast-json-stringify as default option

// Its important not to mix TYPEBOX and ZOD in the same project
// Remember: TYPEBOX generates a JSON schema that fastify uses automatically, whereas ZOD generates its own schema format

// const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
// app.setValidatorCompiler(validatorCompiler);
// app.setSerializerCompiler(serializerCompiler);

// create the server, activating logging in our console
const app: FastifyInstance = fastify({ logger: true })

// register cors plugin, that will add CORS headers automatically
app.register(cors, {
    origin: 'http://localhost:5173',
    credentials: true //allow sending credentials between backend and frontend
});

app.register(fastifyMultipart, {
    limits: {
    fileSize: 20 * 1024 * 1024
    }
});

// "installing" the plugin (function in charge of routing) with /users prefix
app.register(UserRoutes, {prefix: '/users'});
app.register(ProductRoutes, {prefix: '/products'});
app.register(AuthRoutes, {prefix: '/auth'})
app.register(authMsalRoutes, { prefix: '/auth/msal' });
app.register(UploadRoutes, { prefix: '/api' });

export default app;