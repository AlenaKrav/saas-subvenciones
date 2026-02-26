import jwt from 'jsonwebtoken';
import { JWTPayloadSchemaType } from '../schemas/auth.schema';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION_TIME = '24h';

export const generateToken = (payload: JWTPayloadSchemaType): string => {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRATION_TIME})
};

export const verifyToken = (token: string): JWTPayloadSchemaType  => {
    return jwt.verify(token, JWT_SECRET) as JWTPayloadSchemaType;
}