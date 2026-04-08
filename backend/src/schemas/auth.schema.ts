import { Type, Static } from '@sinclair/typebox';

export const User = Type.Object({
    id: Type.String(),
    name: Type.String(),
    email: Type.String({format: 'email'})
});


export const AuthResponseSchema = Type.Object({
    token: Type.String(),
    user: User
});

export const FailAuthResponseSchema = Type.Object({
    success: Type.Boolean(), //success: Type.Literal(false),
    error: Type.String()
})

export const CallBackQuerySchema = Type.Object({
    code: Type.String()
});

export const MsalLoginURLSchema = Type.Object({
    success: Type.Boolean(),
    data: Type.Object({
        loginUrl: Type.String(),
        message: Type.String(),
    })
});

export const MsalTokenRepsonseSchema = Type.Object({
    success: Type.Boolean(),
    data: Type.Object({
        token: Type.String(),
        expiresOn: Type.String(),
        scope: Type.String(),
        user: Type.Object({
            id: Type.String(),
            email: Type.String(),
            name: Type.String(),
        })
    })
});

export const MsalUserResponseSchema = Type.Object({
    success: Type.Boolean(),
    data: Type.Object({
        userId: Type.String(),
        email: Type.String(),
        name: Type.Optional(Type.String())
    })
});

export type AuthResponseSchemaType = Static<typeof AuthResponseSchema>;
export type CallBackQuerySchemaType = Static<typeof CallBackQuerySchema>;
export type MsalLoginURLSchemaType = Static<typeof MsalLoginURLSchema>;
export type MsalTokenRepsonseSchemaType = Static<typeof MsalTokenRepsonseSchema>;
export type MsalUserResponseSchemaType = Static<typeof MsalUserResponseSchema>;