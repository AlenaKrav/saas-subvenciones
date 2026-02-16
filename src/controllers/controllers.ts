import { FastifyRequest, FastifyReply} from "fastify";
import { v4 as uuid } from 'uuid'
import data from '../data.json'
import { UserType, UserParamsType, CreateUserType, UpdateUserType } from "../schemas/user.schema";

//tipamos la variable users con el tipo exportado del Schema haciendo una copia mutable del array de objetos de nuestro json
let users: UserType[] = [...data]

// tipamos request y reply con los tipos de Fastify para mantener el acceso a los metodos send, y parametros body, request y params
// ademas aqui podemos tipar el request con nuestro propios tipos para decirle a TS que tipo de datos se esperan recibir
// request: FastifyRequest<{ParamsType}> en vez de hacer request.params as {id: string}
// reply no lo podemos tipar aqui sino en el router
export const getUsers = async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
        return reply.send(users)
    } catch (error) {
        console.log(error);
        return reply.status(500)
    }
}

// aqui tipamos los parametros del request con nuestro propio tipo
export const getUserById = async (request: FastifyRequest<{Params: UserParamsType}>, reply:FastifyReply) => {
    //desestrucuramos
    const {id} = request.params;
    const user = users.find(u => u.id === id);
    if(!user) {
        return reply.status(404).send({error: 'User not found'});
    }
    return user;
}


export const createUser = (request: FastifyRequest<{Body: CreateUserType}>, _reply:FastifyReply) => {
    const {name, email } = request.body;
    const newUser = {id: uuid(), name, email};
    users.push(newUser);
    // si lo hacemos asi luego en router no podemos tipar el reply ya que desde aqui se envia FastifyReply y en el router se espera UserType
    // return reply.status(200).send(newUser); 
    // por ello solo devolvemos el objeto
    return newUser;
}

export const updateUser = (request: FastifyRequest<{Params: UserParamsType, Body: UpdateUserType}>, reply:FastifyReply) => {
    //obtenemos el id del parametro de la url
    const {id} = request.params;
    //obtenemos si en el body hay el nombre o el email
    const {name, email } = request.body;
    //user encontrado en json
    const user = users.find(u => u.id === id);
    if(!user) {
        return reply.status(404).send({error: 'User not found'});
    }
    //si nos viene el nombre actualizamos el user encontrado antes con ese nombre
    if(name) {
        user.name = name;
    }
    if(email){
        user.email = email;
    }
    return user;
}

export const deleteUser = (request: FastifyRequest<{Params: UserParamsType}>, reply:FastifyReply) => {
    const {id} = request.params;
    //el index del user con el mismo id que en el parametro
    const index = users.findIndex(u => u.id === id);
    //si no lo hemos encontrado
    if(index === -1) {
        return reply.status(404).send({error: 'User not found'});
    }
    //borramos 1 elemento empezando desde el indice del user encontrado
    users.splice(index, 1);
    return {message: 'User deleted'}
}