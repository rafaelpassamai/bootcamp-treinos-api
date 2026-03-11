import { fromNodeHeaders } from "better-auth/node";
import type { FastifyReply, FastifyRequest } from "fastify";
import { auth } from "../lib/auth.js";
import { makeCreateWorkoutPlan } from "../usecases/factories/make-create-workout-plan.js";
import { UnauthorizedError } from "../errors/unauthorized-error.js";
import { CreateWorkoutPlanBody } from "../schemas/workout-plan.schema.js";
import { makeListWorkoutPlans } from "../usecases/factories/make-list-workout-plans.js";

export class WorkoutPlanController {
  async handle(
    request: FastifyRequest<{ Body: CreateWorkoutPlanBody }>,
    reply: FastifyReply,
  ) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      throw new UnauthorizedError();
    }

    const result = await makeCreateWorkoutPlan().execute({
      userId: session.user.id,
      name: request.body.name,
      workoutDays: request.body.workoutDays,
    });

    return reply.status(201).send(result);
  }

  async list(
    request: FastifyRequest<{ Querystring: { active?: boolean } }>,
    reply: FastifyReply,
  ) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      throw new UnauthorizedError();
    }

    const result = await makeListWorkoutPlans().execute({
      userId: session.user.id,
      active: request.query.active,
    });

    return reply.status(200).send(result);
  }
}
