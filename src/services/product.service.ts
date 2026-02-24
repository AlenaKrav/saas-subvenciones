import {prisma} from '../bd/prisma';

export async function getAllProducts(){
    return prisma.product.findMany();
};

export async function getProduct(id: number){
    return prisma.product.findUnique({
        where: {
            id,
        }
    });
};

export async function createProduct(name: string, description: string){
    return prisma.product.create({
        data: {name, description}
    })
};

export async function updateProduct(id: number, data: { name?: string; description?: string }){
    return prisma.product.update({
        where: {id},
        data
    });
};

export async function deleteProduct(id: number){
    return prisma.product.delete({
        where: {id}
    });
}