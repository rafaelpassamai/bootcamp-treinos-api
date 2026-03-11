import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { WorkoutPlanController } from "../controllers/workout-plan.controller.js";
import {
  createWorkoutPlanBodySchema,
  createWorkoutPlanResponseSchema,
  getWorkoutDayParamsSchema,
  getWorkoutDayResponseSchema,
  GetWorkoutPlanResponseSchema,
  ListWorkoutPlansQuerySchema,
  listWorkoutPlansResponseSchema,
} from "../schemas/workout-plan.schema.js";
import { ErrorSchema } from "../schemas/error-schema.js";
import {
  startWorkoutSessionParamsSchema,
  startWorkoutSessionResponseSchema,
} from "../schemas/start-workout-session.schema.js";
import { StartWorkoutSessionController } from "../controllers/start-workout-session.controller.js";
import {
  updateWorkoutSessionParamsSchema,
  updateWorkoutSessionBodySchema,
  updateWorkoutSessionResponseSchema,
} from "../schemas/update-workout-session.schema.js";
import { UpdateWorkoutSessionController } from "../controllers/update-workout-session.controller.js";
import { GetWorkoutPlanController } from "../controllers/get-workout-plan.controller.js";
import { getWorkoutPlanParamsSchema } from "../schemas/workout-plan.schema.js";
import { GetWorkoutDayController } from "../controllers/get-workout-day.controller.js";

const workoutPlanController = new WorkoutPlanController();
const startWorkoutSessionController = new StartWorkoutSessionController();
const updateWorkoutSessionController = new UpdateWorkoutSessionController();
const getWorkoutPlanController = new GetWorkoutPlanController();
const getWorkoutDayController = new GetWorkoutDayController();

export const workoutPlanRoutes = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      operationId: "createWorkoutPlan",
      tags: ["Workout Plan"],
      summary: "Create a workout plan",
      body: createWorkoutPlanBodySchema,
      response: {
        201: createWorkoutPlanResponseSchema,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: workoutPlanController.handle.bind(workoutPlanController),
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/:workoutPlanId/days/:workoutDayId/sessions",
    schema: {
      operationId: "startWorkoutSession",
      tags: ["Workout Plan"],
      summary: "Start a workout session",
      params: startWorkoutSessionParamsSchema,
      response: {
        201: startWorkoutSessionResponseSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        409: ErrorSchema,
        422: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: startWorkoutSessionController.handle.bind(
      startWorkoutSessionController,
    ),
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/:workoutPlanId/days/:workoutDayId/sessions/:sessionId",
    schema: {
      operationId: "updateWorkoutSession",
      tags: ["Workout Plan"],
      summary: "Update a workout session",
      params: updateWorkoutSessionParamsSchema,
      body: updateWorkoutSessionBodySchema,
      response: {
        200: updateWorkoutSessionResponseSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: updateWorkoutSessionController.handle.bind(
      updateWorkoutSessionController,
    ),
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/:workoutPlanId",
    schema: {
      operationId: "getWorkoutPlan",
      tags: ["Workout Plan"],
      summary: "Get a workout plan",
      params: getWorkoutPlanParamsSchema,
      response: {
        200: GetWorkoutPlanResponseSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: getWorkoutPlanController.handle.bind(getWorkoutPlanController),
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/:workoutPlanId/days/:workoutDayId",
    schema: {
      operationId: "getWorkoutDay",
      tags: ["Workout Plan"],
      summary: "Get a workout day",
      params: getWorkoutDayParamsSchema,
      response: {
        200: getWorkoutDayResponseSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: getWorkoutDayController.handle.bind(getWorkoutDayController),
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      operationId: "listWorkoutPlans",
      tags: ["Workout Plan"],
      summary: "List workout plans",
      querystring: ListWorkoutPlansQuerySchema,
      response: {
        200: listWorkoutPlansResponseSchema,
        401: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: workoutPlanController.list.bind(workoutPlanController),
  });
};
