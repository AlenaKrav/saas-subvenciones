import { FastifyRequest, FastifyReply } from 'fastify';
import { JWTPayloadSchemaType } from '../schemas/auth.schema';
import { verifyToken } from "../services/auth.jwt";

//Extendemos el objeto Fastify Request para que tenga una propiedad adicional - user
// además tipamos request.user de la siguente forma
// declare module 'fastify' {
//     interface FastifyRequest {
//         user?: JWTPayloadSchemaType
//     }
// }

export async function authenticate(request: FastifyRequest, reply: FastifyReply ){
    //obtenemos el token
    const authHeader = request.headers.authorization;
    console.log(authHeader)
    // si no tenemos token
    if(!authHeader){
        return reply.code(401).send({
        success: false,
        error: 'There is no valid authentication token'
      });
    }
    // si tenemos token, lo dividimos por el espacio 'Bearer tokenxxx"
    const tokenParts = authHeader.split(' ');

    //si las partes del token obtenidas no son 2 y la primera parte no es un Bearer
    if(tokenParts.length !== 2 || tokenParts[0] !== 'Bearer'){
        return reply.code(401).send({
            success: false,
            error: 'Invalid token format'
        })
    }

    //obtenemos el token en sí
    const token = tokenParts[1];
    try{
    // jwt.verify devuelve jwtPayload con cualquier propiedad que le metamos
    // aqui TS todavia no sabe que con jwt.sign() le metimos userId y email
    // al hacer el casteo explicito le decimos a TS que forma tiene exactamente
    const decodedToken = verifyToken(token);
    request.user = decodedToken;
    }
    catch{
        return reply.code(401).send({
            success: false,
            error: 'Invalid or expired token'
        });
    }

}