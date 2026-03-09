// import {z} from 'zod';
import { Type, Static } from "@sinclair/typebox";

// export const Product = z.object({
//     id: z.int(),
//     name: z.string(),
//     description: z.string()
// });

// export const ProductParams = Product.pick({id: true});

// export const CreateProduct = z.object({
//     name: z.string().min(3),
//     description: z.string().min(5)
// });

// export const UpdateProduct = CreateProduct.partial();

// export type ProductType = z.infer<typeof Product>;
// export type ProuctParamsType = z.infer<typeof ProductParams>;
// export type CreateProductType = z.infer<typeof CreateProduct>;
// export type UpdateProductType = z.infer<typeof UpdateProduct>;


export const Product = Type.Object({
    id: Type.Number(),
    name: Type.String(),
    description: Type.String()
});

export const ProductParams = Type.Pick(Product, ['id']);

export const CreateProduct = Type.Object({
        name: Type.String({minLength:3}),
        description: Type.String({minLength: 5})
});

export const UpdateProduct = Type.Partial(CreateProduct);

export type ProductType = Static<typeof Product>;
export type ProuctParamsType = Static<typeof ProductParams>;
export type CreateProductType = Static<typeof CreateProduct>;
export type UpdateProductType = Static<typeof UpdateProduct>;

