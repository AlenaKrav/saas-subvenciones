import { FastifyInstance } from "fastify";
import { aiController } from "../controllers/ai.controllers";

export default async function AiRoutes(fastify: FastifyInstance) {
    fastify.post('/ai', {}, aiController)
}