// src/routes/stats/index.ts
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { GetStatsController } from "../controllers/get-stats.controller.js";
import {
  getStatsResponseSchema,
  StatsQuerySchema,
} from "../schemas/stats.schema.js";
import { ErrorSchema } from "../schemas/error-schema.js";

const getStatsController = new GetStatsController();

export const statsRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      operationId: "getStats",
      tags: ["Stats"],
      summary: "Get workout stats",
      querystring: StatsQuerySchema,
      response: {
        200: getStatsResponseSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: getStatsController.handle.bind(getStatsController),
  });
};
