import { FastifyRequest, FastifyReply} from "fastify";
import { hashPassword, comparePassword } from "../services/auth.hash";
import { RegisterSchemaType, LoginSchemaType } from "../schemas/auth.schema";
import { registerUser, getUserByEmail } from "../services/auth.service";
import { generateToken } from "../services/auth.jwt";



export const registerHandler = async (request: FastifyRequest<{Body: RegisterSchemaType}>, reply: FastifyReply) => {
    const { name, email, password} = request.body;
        const existingUser = await getUserByEmail({email});

    if(existingUser){
        return reply.status(400).send({
            success: false,
            error: 'This is email is already registered'
        })
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await registerUser({name, email, password: hashedPassword});
    
    //GENERAR TOKEN para 24h
    // sacar esta funcion fuera
    const token = generateToken({userId: newUser.id, email: newUser.email});

    return reply.code(201).send({
        success: true,
        data: {
            token,
            user: newUser
        }
    });

}

export const loginHandler = async (request: FastifyRequest<{Body: LoginSchemaType}>, reply: FastifyReply) => {
    const {email, password } = request.body;
    const existingUser = await getUserByEmail({email});
    
    if(!existingUser){
        return reply.status(401).send({
            success: false,
            error: "Invalid credentials"
        })
    }

    const isPasswordValid = await comparePassword(password, existingUser.password);

    if(!isPasswordValid){
        return reply.status(401).send({
            success: false,
            error: "Invalid credentials"
        })
    }

    //generamos token
    const token = generateToken({userId: existingUser.id, email: existingUser.email});

    //aunque el schema de validacion usado no devuelve el password, para asegurarnos de que nunca se llega a devolver el password
    //creamos otro objeto pero sin el password
    //setemos password con _ (existe pero no se usa), copiamos esa propiedad y el resto de propiedades de existingUser a user userWithoutPassword
    const {password: _, ...userWithoutPassword} = existingUser;

    //devolvemos token
    return reply.code(200).send({
        success: true,
        data: {
            token,
            user: userWithoutPassword //ahora si que si no devolvemos el password
        }
    });
}

export const meHandler = async(request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(200).send(request.user) //viene del hook, ya que es allí donde hemos extendido el objeto FastifyRequest que ahora lleva esa propieda opcional
}