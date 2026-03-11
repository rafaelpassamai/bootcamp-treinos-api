import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UserGoalController } from "../controllers/user-goal.controller.js";
import {
  CreateUserGoalBodySchema,
  UpdateGoalProgressBodySchema,
  UserGoalResponseSchema,
} from "../schemas/user-goal.schema.js";

const userGoalController = new UserGoalController();

export const userGoalRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      operationId: "createUserGoal",
      tags: ["User Goals"],
      summary: "Create a user goal",
      body: CreateUserGoalBodySchema,
      response: { 201: UserGoalResponseSchema },
    },
    handler: userGoalController.create.bind(userGoalController),
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      operationId: "getUserGoals",
      tags: ["User Goals"],
      summary: "List user goals",
      response: { 200: z.array(UserGoalResponseSchema) },
    },
    handler: userGoalController.list.bind(userGoalController),
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/:id/progress",
    schema: {
      operationId: "updateGoalProgress",
      tags: ["User Goals"],
      summary: "Update goal progress",
      params: z.object({ id: z.string() }),
      body: UpdateGoalProgressBodySchema,
      response: { 200: UserGoalResponseSchema },
    },
    handler: userGoalController.updateProgress.bind(userGoalController),
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/:id/complete",
    schema: {
      operationId: "completeUserGoal",
      tags: ["User Goals"],
      summary: "Complete a user goal",
      params: z.object({ id: z.string() }),
      response: { 200: UserGoalResponseSchema },
    },
    handler: userGoalController.complete.bind(userGoalController),
  });
};
