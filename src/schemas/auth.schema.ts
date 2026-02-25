import { Type, Static } from '@sinclair/typebox';
import { User } from './user.schema';
// Tipos solo usados para la utenticacion no para hacer CRUD
export const RegisterSchema = Type.Object({
    name: Type.String({ minLength: 3 }),
    email: Type.String({format: 'email'}),
    password: Type.String({ minLength: 8 })
});

export const LoginSchema = Type.Object({
    email: Type.String({format: 'email'}),
    password: Type.String()
});

export const AuthResponseSchema = Type.Object({
    token: Type.String(),
    user: User //reutilizamos el tipo generico de user del otro esquema, NO INCLUYE PASSWORD
});

export const JWTPayloadSchema = Type.Object({
    userId: Type.String(),
    email: Type.String()
});

export const SuccessAuthResponseSchema = Type.Object({
    success: Type.Boolean(),
    data: AuthResponseSchema
});

export const FailAuthResponseSchema = Type.Object({
    success: Type.Boolean(),
    error: Type.String()
})

export type RegisterSchemaType = Static<typeof RegisterSchema>;
export type LoginSchemaType = Static<typeof LoginSchema>;
export type AuthResponseSchemaType = Static<typeof AuthResponseSchema>;
export type JWTPayloadSchemaType = Static<typeof JWTPayloadSchema>;
export type SuccessAuthResponseSchemaType = Static<typeof SuccessAuthResponseSchema>;