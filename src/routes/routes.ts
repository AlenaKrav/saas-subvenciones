import fastify, { type FastifyInstance } from "fastify";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../controllers/controllers";
import { User, UserType, UserParams, UserParamsType, UpdateUser, UpdateUserType, CreateUser, CreateUserType } from "../shemas/user.schema";
import { Type } from "@sinclair/typebox";
import { Create } from "@sinclair/typebox/value";


// esta funcion como parametro recibe la instancia del servidor fastify
// que nos permite definir rutas fastify.get y etc
// nos da acceso a todo lo que el servidor puede hacer dentro de ese plugin, incluyendo rutas, hooks y decoradores
export default async function UserRoutes (fastify: FastifyInstance) {
    // aqui es donde podemos tipar el reply con el tipo TS del schema
    fastify.get<{Reply: UserType []}>('/', {
        schema: {
            response: {
                200: Type.Array(User)
            }
        }
    }, getUsers);

    fastify.post<{Body: CreateUserType, Reply: UserType}>('/', {
        schema: {
            body: CreateUser,
            response: {
                200: User
            }
        }
    }, 
        createUser);
    fastify.get<{Params: UserParamsType, Reply: UserType}>('/:id', {
        schema: {
            params: UserParams,
            response: {
                200: User
            }
        }
    }, getUserById);

    fastify.patch<{Params: UserParamsType, Body: UpdateUserType, UpReply: UserType}>('/:id', {
        schema: {
            params: UserParams,
            body: UpdateUser,
            response:{
                200: User
            }
        }
    }, updateUser);

    fastify.delete<{Params: UserParamsType}>('/:id', {
        schema: {
            params: UserParams
        }
    }, deleteUser);
}