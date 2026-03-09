import { FastifyRequest, FastifyReply} from "fastify";
import { UserType, UserParamsType, CreateUserType, UpdateUserType } from "../schemas/user.schema";
import { getAllUsers, getUser, createUser, updateUser, deleteUser } from "../services/user.service";

// tipamos request y reply con los tipos de Fastify para mantener el acceso a los metodos send, y parametros body, request y params
// ademas aqui podemos tipar el request con nuestro propios tipos para decirle a TS que tipo de datos se esperan recibir
// request: FastifyRequest<{ParamsType}> en vez de hacer request.params as {id: string}
// reply no lo podemos tipar aqui sino en el router
export const getUsersHandler = async (_request: FastifyRequest, reply: FastifyReply) => {
        const users = await getAllUsers();
        return reply.code(200).send(users)
}

export const getUserByIdHandler = async (request: FastifyRequest<{Params: UserParamsType}>, reply:FastifyReply) => {
    const {id} = request.params;
    const user = await getUser(id);
    if(!user) {
        return reply.status(404).send({error: 'User not found'});
    }
    return reply.code(200).send(user);
}


export const createUserHandler = async (request: FastifyRequest<{Body: CreateUserType}>, reply:FastifyReply) => {
    const { name, email, password } = request.body;
    const newUser = await createUser(name, email, password);
    return reply.code(201).send(newUser);
}

export const updateUserHandler = async (request: FastifyRequest<{Params: UserParamsType, Body: UpdateUserType}>, reply:FastifyReply) => {
    const {id} = request.params;
    const user = await getUser(id);
    if(!user) {
        return reply.status(404).send({error: 'User not found'});
    }
    //definismo el objeto que nos puede venir del request
    const data: UpdateUserType = request.body;

    //si el objeto que nos viene le faltan ambos campos
    if(Object.keys(data).length === 0){
        return reply.status(404).send({error: 'No fields provided'});
    }

    const { name, email } = data;
    const newUser = await updateUser(id, name, email);
    return reply.code(201).send(newUser);
}

export const deleteUserHandler = async (request: FastifyRequest<{Params: UserParamsType}>, reply:FastifyReply) => {
    const {id} = request.params;
    const user = await getUser(id);
    if(!user) {
        return reply.status(404).send({error: 'User not found'});
    }
    await deleteUser(id);
    return {message: 'User deleted'}
}