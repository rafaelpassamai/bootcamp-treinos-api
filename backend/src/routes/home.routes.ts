import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { HomeController } from "../controllers/home.controller.js";
import {
  getHomeDataParamsSchema,
  getHomeDataSchema,
} from "../schemas/home.schema.js";
import { ErrorSchema } from "../schemas/error-schema.js";

const homeController = new HomeController();

export const homeRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/:date",
    schema: {
      operationId: "getHomeData",
      tags: ["Home"],
      summary: "Get home page data",
      params: getHomeDataParamsSchema,
      response: {
        200: getHomeDataSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: homeController.handle.bind(homeController),
  });
};
