// importamos el tipo para TS
import fastify, { type FastifyInstance } from "fastify";
import UserRoutes from "./routes/user.routes";
import ProductRoutes from "./routes/product.routes";
import { ZodTypeProvider, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';



// Si queremos usar ZOD en vez de TYPEBOX, debemos:
// 1. usar su provider de tipos a nivel de app
// 2. usar explicitamente su compilador, ya que fastify usa por defecto AJV para validar
// 3. usar explicitamente su serializador, ya que fastify usa fast-json-stringify por defecto
// Lo suyo no mezclar typebox con zod, typebox genera un json schema automaticamente que fastify usa, mientras que Zod genera su ppio schema
// const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
// app.setValidatorCompiler(validatorCompiler);
// app.setSerializerCompiler(serializerCompiler);

// creamos el servidor, activando el log en la consola
const app: FastifyInstance = fastify({ logger: true })
// se "monta/instala" el plugin (funcion que se encarga de enrutamiento) bajo el prefijo /users
app.register(UserRoutes, {prefix: '/users'});
app.register(ProductRoutes, {prefix: '/products'});

export default app;