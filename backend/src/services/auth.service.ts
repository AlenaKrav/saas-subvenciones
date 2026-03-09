import {prisma} from '../bd/prisma';
import { v4 as uuid } from 'uuid';

// Usaremos para comproba el user durante el login
export async function getUserByEmail(data: {email: string}){
    return prisma.user.findUnique({
        where: {
            email: data.email
        }
    });
};

//usaremos para obtener la info del user autenticado
export async function getUserById(data: {id: string}){
    return prisma.user.findUnique({
        where: {
            id: data.id
        },
        select: {
            id: true,
            email: true,
            name: true
        }
    });
};

export async function registerUser(data: {name: string, email:string, password: string}){
    return await prisma.user.create({
        data: {
            id: uuid(),
            name: data.name,
            email: data.email,
            password: data.password
        },
        omit: {password: true} //omitimos el password para que no lo devuelva
    });
};


