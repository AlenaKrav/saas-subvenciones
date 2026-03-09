import { type FastifyInstance } from "fastify";
import { getAllProductsHandler, getProductHandler, createProductHandler, updateProductHandler, deleteProductHandler } from "../controllers/product.controllers"; 
import { Product, ProductParams, CreateProduct, UpdateProduct, ProductType, ProuctParamsType, CreateProductType, UpdateProductType } from "../schemas/product.schema";
import { Type } from "@sinclair/typebox";
import { authenticate } from "../hooks/auth.hook";
// import {z} from 'zod';

export default async function ProductRoutes (fastify: FastifyInstance) {
    fastify.get<{Reply: ProductType []}>('/', {
        onRequest: [authenticate],
        schema: {
            response: {
                200: Type.Array(Product)
            }
        }
    }, getAllProductsHandler);

    fastify.post<{Body: CreateProductType, Reply: ProductType}>('/', {
        onRequest: [authenticate],
        schema: {
            body: CreateProduct,
            response: {
                201: Product
            }
        }
    }, createProductHandler);

    fastify.get<{Params: ProuctParamsType, Reply: ProductType}>('/:id', {
        onRequest: [authenticate],
        schema: {
            params: ProductParams,
            response: {
                200: Product
            }
        }
    }, getProductHandler);

    fastify.patch<{Params: ProuctParamsType, Body: UpdateProductType, reply: ProductType}>('/:id', {
        onRequest: [authenticate],
        schema: {
            params: ProductParams,
            body: UpdateProduct,
            response: {
                201: Product
            }
        }
    }, updateProductHandler);


    fastify.delete<{Params: ProuctParamsType }>('/:id', {
        onRequest: [authenticate],
        schema: {
            params: ProductParams,
        }
    }, deleteProductHandler)



}