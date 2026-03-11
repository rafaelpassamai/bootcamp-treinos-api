import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { MeController } from "../controllers/me.controller.js";
import {
  UpsertUserTrainDataBodySchema,
  UserTrainDataResponseSchema,
} from "../schemas/me.schema.js";

const meController = new MeController();

export const meRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      operationId: "getUserTrainData",
      tags: ["Me"],
      summary: "Get user train data",
      response: {
        200: UserTrainDataResponseSchema.nullable(),
      },
    },
    handler: meController.get.bind(meController),
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PUT",
    url: "/",
    schema: {
      operationId: "upsertUserTrainData",
      tags: ["Me"],
      summary: "Upsert user train data",
      body: UpsertUserTrainDataBodySchema,
      response: {
        200: UserTrainDataResponseSchema,
      },
    },
    handler: meController.upsert.bind(meController),
  });
};
