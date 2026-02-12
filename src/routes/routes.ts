import fastify, { type FastifyInstance } from "fastify";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../controllers/controllers";

// esta funcion como parametro recibe la instancia del servidor fastify
// que nos permite definir rutas fastify.get y etc
// nos da acceso a todo lo que el servidor puede hacer dentro de ese plugin, incluyendo rutas, hooks y decoradores
export default async function UserRoutes (fastify: FastifyInstance) {
    fastify.get('/', getUsers);
    fastify.post('/', createUser);
    fastify.get('/:id', getUserById);
    fastify.patch('/:id', updateUser);
    fastify.delete('/:id', deleteUser);
}