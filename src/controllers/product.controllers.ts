import { FastifyRequest, FastifyReply} from "fastify";
import { UpdateProductType, CreateProductType, ProuctParamsType} from "../schemas/product.schema";
import { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../services/product.service";

export const getAllProductsHandler = async (_request: FastifyRequest, reply: FastifyReply) => {
    const products = await getAllProducts();
    return reply.code(200).send(products);
};

export const getProductHandler = async(request: FastifyRequest<{Params: ProuctParamsType}>, reply: FastifyReply) => {
    const {id} = request.params;
    const product = await getProduct(id);

    if(!product){
        return reply.status(404).send({error: 'Product not found'})
    }

    return reply.code(200).send(product);
};

export const createProductHandler = async(request: FastifyRequest<{Body: CreateProductType}>, reply: FastifyReply) => {
    const { name, description } = request.body;
    const newProduct = await createProduct(name, description);
    return reply.code(200).send(newProduct);
};

export const updateProductHandler= async(request: FastifyRequest<{Params: ProuctParamsType, Body: UpdateProductType}>, reply: FastifyReply) => {
    const {id} = request.params;
    const data = request.body;

    const product = await getProduct(id);

    if(!product) {
        return reply.status(404).send({error: 'Product not found'})
    }

    if(Object.keys(data).length === 0){
        return reply.status(404).send({error: 'No fields provided'});
    }

    const updatedProduct = await updateProduct(id, data);
    return reply.code(201).send(updatedProduct);

}

export const deleteProductHandler = async(request: FastifyRequest<{Params: ProuctParamsType}>, reply: FastifyReply) => {
    const {id} = request.params;
    const product = await getProduct(id);

     if(!product){
        return reply.status(404).send({error: 'Product not found'})
    }

    await deleteProduct(id);
    return {message: 'User deleted'}
}