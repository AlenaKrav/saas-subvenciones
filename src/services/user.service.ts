import {prisma} from '../bd/prisma';
import { v4 as uuid } from 'uuid';

export async function getAllUsers() {
    return prisma.user.findMany();
}

export async function getUser(id: string){
    return prisma.user.findUnique({
        where:{
            id,
        }
    })
}

export async function createUser(name: string, email:string){
    return prisma.user.create({
        data: {id: uuid(), name, email}
    })
}

export async function updateUser(id: string, name?: string, email?:string) {
    return prisma.user.update({
        where: {id},
        data: {name, email}
    })
}

export async function deleteUser(id: string){
    return prisma.user.delete({
        where: {id},
    })
}