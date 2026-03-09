import { Type, Static } from "@sinclair/typebox";

// Tipo Generico de User
export const User = Type.Object({
    id: Type.String(),
    name: Type.String(),
    email: Type.String({format: 'email'})
});

// export const UserParams = Type.Object({
//     id: Type.String()
// })

export const UserParams = Type.Pick(User, ['id']);

export const CreateUser = Type.Object({
        name: Type.String({minLength:2}),
        email: Type.String({format: 'email', minLength: 5}),
        password: Type.String({ minLength: 8 })
});

// export const UpdateUser = Type.Object({
//     name: Type.Optional(Type.String({minLength:2})),
//     email: Type.Optional(Type.String({format: 'email'}))
// })

export const UpdateUser = Type.Partial(CreateUser); //construye el tipo sobre el tipo CreateUser pero hace que sus propiedades sean opcionales

// Exportamos los tipos
export type UserType = Static<typeof User>
export type UserParamsType = Static<typeof UserParams>
export type CreateUserType = Static<typeof CreateUser>
export type UpdateUserType = Static<typeof UpdateUser>