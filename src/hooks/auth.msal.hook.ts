import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyMsalToken } from '../services/auth.msal';

declare module 'fastify' {
    interface FastifyRequest {
        user: {
            userId: string;
            email: string;
            name?: string;
        };
    }
}

export async function authenticateMsal(request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return reply.code(401).send({
            success: false,
            error: 'There is no valid authentication token'
        });
    }
    const tokenParts = authHeader.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return reply.code(401).send({
            success: false,
            error: 'Invalid token format'
        })
    }

    const token = tokenParts[1];
    try {
        const decodedToken = await verifyMsalToken(token);
        request.user = decodedToken;
    }
    catch {
        return reply.code(401).send({
            success: false,
            error: 'Invalid or expired token'
        });
    }

}