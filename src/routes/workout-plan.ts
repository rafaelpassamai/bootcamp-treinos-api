import { fromNodeHeaders } from "better-auth/node";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { NotFoundError } from "../errors/index.js";
import { ConflictError, WorkoutPlanNotActiveError } from "../errors/index.js";
import { auth } from "../lib/auth.js";
import { ErrorSchema, WorkoutPlanSchema } from "../schemas/index.js";
import { CreateWorkoutPlan, OutputDto } from "../usecases/CreateWorkoutPlan.js";
import { StartWorkoutSession } from "../usecases/StartWorkoutSession.js";

export const workoutPlanRoutes = async (app: FastifyInstance) => {
  // POST /workout-plans/:planId/days/:dayId/sessions
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/:planId/days/:dayId/sessions",
    schema: {
      tags: ["Workout Plan"],
      summary: "Start a workout session for a specific workout day",
      params: {
        type: "object",
        properties: {
          planId: { type: "string", format: "uuid" },
          dayId: { type: "string", format: "uuid" },
        },
        required: ["planId", "dayId"],
      },
      response: {
        201: z.object({ userWorkoutSessionId: z.string() }),
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        409: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      try {
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(request.headers),
        });

        if (!session) {
          return reply
            .status(401)
            .send({ error: "Unauthorized", code: "UNAUTHORIZED" });
        }

        const { planId, dayId } = request.params as {
          planId: string;
          dayId: string;
        };

        const start = new StartWorkoutSession();
        const result = await start.execute({
          userId: session.user.id,
          planId,
          dayId,
        });

        return reply.status(201).send(result);
      } catch (error) {
        app.log.error(error);
        if (error instanceof NotFoundError) {
          return reply
            .status(404)
            .send({ error: error.message, code: "NOT_FOUND" });
        }
        if (error instanceof WorkoutPlanNotActiveError) {
          return reply
            .status(400)
            .send({ error: error.message, code: "WORKOUT_PLAN_NOT_ACTIVE" });
        }
        if (error instanceof ConflictError) {
          return reply
            .status(409)
            .send({ error: error.message, code: "ALREADY_STARTED" });
        }
        return reply.status(500).send({
          error: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      tags: ["Workout Plan"],
      summary: "Create a new workout plan",
      body: WorkoutPlanSchema.omit({ id: true }),
      response: {
        201: WorkoutPlanSchema,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      try {
        // Diagnostic logs to help debug missing session/cookie
        app.log.debug(
          { hasCookie: Boolean(request.headers.cookie) },
          "workout-plans: incoming cookies",
        );

        const session = await auth.api.getSession({
          headers: fromNodeHeaders(request.headers),
        });

        app.log.debug(
          { sessionPresent: Boolean(session) },
          "workout-plans: session lookup result",
        );

        if (!session) {
          app.log.info(
            "Unauthorized request to /workout-plans: no valid session",
          );
          return reply.status(401).send({
            error: "Unauthorized",
            code: "UNAUTHORIZED",
          });
        }
        const createWorkoutPlan = new CreateWorkoutPlan();
        const result: OutputDto = await createWorkoutPlan.execute({
          userId: session.user.id,
          name: request.body.name,
          workoutDays: request.body.workoutDays,
        });
        return reply.status(201).send(result);
      } catch (error) {
        app.log.error(error);
        if (error instanceof NotFoundError) {
          return reply.status(404).send({
            error: error.message,
            code: "NOT_FOUND",
          });
        }
        return reply.status(500).send({
          error: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
};
