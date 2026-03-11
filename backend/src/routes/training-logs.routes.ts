import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { TrainingLogController } from "../controllers/training-log.controller.js";
import {
  CreateTrainingLogBodySchema,
  TrainingLogResponseSchema,
} from "../schemas/training-log.schema.js";

const trainingLogController = new TrainingLogController();

export const trainingLogRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      operationId: "createTrainingLog",
      tags: ["Training Log"],
      summary: "Create a training log",
      body: CreateTrainingLogBodySchema,
      response: {
        201: TrainingLogResponseSchema,
      },
    },
    handler: trainingLogController.create.bind(trainingLogController),
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      operationId: "getTrainingLogs",
      tags: ["Training Log"],
      summary: "List training logs",
      response: {
        200: z.array(TrainingLogResponseSchema),
      },
    },
    handler: trainingLogController.list.bind(trainingLogController),
  });
};
