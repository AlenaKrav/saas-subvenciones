import { Type, Static } from '@sinclair/typebox';

export const UploadBodySchema = Type.Object({
    title: Type.Optional(Type.String({minLength: 3, maxLength: 30})),
});

export const UploadErrorResponseSchema = Type.Object({
    error: Type.String()
});

export const UploadSuccessSchema = Type.Object({
    filename: Type.String()
});

export type UploadBodyType = Static<typeof UploadBodySchema>;
export type UploadErrorResponseType = Static<typeof UploadErrorResponseSchema>;
export type UploadSuccessType = Static<typeof UploadSuccessSchema>;