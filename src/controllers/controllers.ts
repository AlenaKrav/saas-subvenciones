import { FastifyRequest, FastifyReply} from "fastify";
import { v4 as uuid } from 'uuid'
import data from './data.json'

interface User {
    id: string
    name: string
    email: string
}

//tipamos la variable users haciendo una copia mutable del array de objetos de nuestro json
let users: User[] = [...data]

export const getUsers = async (_request: FastifyRequest, reply:FastifyReply) => {
    try {
        return reply.send(users)
    } catch (error) {
        console.log(error);
        return reply.status(500)
    }
}

export const getUserById = async (request: FastifyRequest, reply:FastifyReply) => {
    //desestrucuramos
    const {id} = request.params as {id: string};
    const user = users.find(u => u.id === id);
    if(!user) {
        return reply.status(404).send({error: 'User not found'});
    }
    return user;
}

export const createUser = (request: FastifyRequest, reply:FastifyReply) => {
    const {name, email } = request.body as {name?:string, email?:string};
    const newUser = {id: uuid(), name, email};
    users.push(newUser);
    return reply.status(200).send(newUser);
}

export const updateUser = (request: FastifyRequest, reply:FastifyReply) => {
    //obtenemos el id del parametro de la url
    const {id} = request.params as {id: string};
    //obtenemos si en el body hay el nombre o el email
    const {name, email } = request.body as {name?:string, email?:string};
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

export const deleteUser = (request: FastifyRequest, reply:FastifyReply) => {
    const {id} = request.params as {id: string};
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