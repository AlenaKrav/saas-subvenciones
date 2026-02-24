import {z} from 'zod';

export const Product = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string()
});

export const ProductParams = Product.pick({id: true});

export const CreateProduct = z.object({
    name: z.string().min(3),
    description: z.string().min(5)
});

export const UpdateProduct = CreateProduct.partial();


export type ProductType = z.infer<typeof Product>;
export type ProuctParamsType = z.infer<typeof ProductParams>;
export type CreateProductType = z.infer<typeof CreateProduct>;
export type UpdateProductType = z.infer<typeof UpdateProduct>;
