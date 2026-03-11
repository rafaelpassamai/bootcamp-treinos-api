import { FastifyReply, FastifyRequest } from "fastify";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { UnauthorizedError } from "../errors/unauthorized-error.js";
import { makeStartWorkoutSession } from "../usecases/factories/make-start-workout-session.js";
import { StartWorkoutSessionParams } from "../schemas/start-workout-session.schema.js";

export class StartWorkoutSessionController {
  async handle(
    request: FastifyRequest<{ Params: StartWorkoutSessionParams }>,
    reply: FastifyReply,
  ) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      throw new UnauthorizedError();
    }

    const startWorkoutSession = makeStartWorkoutSession();

    const result = await startWorkoutSession.execute({
      userId: session.user.id,
      workoutPlanId: request.params.workoutPlanId,
      workoutDayId: request.params.workoutDayId,
    });

    return reply.status(201).send(result);
  }
}
