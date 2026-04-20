import { FastifyRequest, FastifyReply } from "fastify";
import axios from "axios";
import "dotenv/config";

const OLLAMA_HOST = process.env.OLLAMA_HOST!

type AiRequestBody = {
    prompt: string
    model?: string
}

export async function aiController(request: FastifyRequest<{ Body: AiRequestBody }>, reply: FastifyReply) {
    const { prompt, model = "gemma4:latest" } = request.body;

  try {
    const res = await axios.post(`${OLLAMA_HOST}/api/generate`,
      {
        model,
        prompt,
        stream: false //to receive the response in application/json format instead of newline-delimited JSON format
      },
      {
        timeout: 60000
      }
    )

    return reply.send({
      ok: true,
      response: res.data.response
    })

  } catch (error: any) {
    console.error("AXIOS FULL ERROR:", error)

    return reply.code(500).send({
      ok: false,
      message: error.message,
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      address: error.address,
      port: error.port
    })
  }


}