// importamos el tipo para TS
import fastify, { type FastifyInstance } from "fastify";
import UserRoutes from "./routes/user.routes";

// creamos el servidor, activando el log en la consola
const app:FastifyInstance = fastify({logger:true});

// se "monta/instala" el plugin (funcion que se encarga de enrutamiento) bajo el prefijo /users
app.register(UserRoutes, {prefix: '/users'});

export default app;