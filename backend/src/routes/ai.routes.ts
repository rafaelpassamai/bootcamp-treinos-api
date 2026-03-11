import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { AiController } from "../controllers/ai.controller.js";

const aiController = new AiController();

export const aiRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      tags: ["AI"],
      summary: "Chat with AI personal trainer",
    },
    handler: aiController.handle.bind(aiController),
  });
};
