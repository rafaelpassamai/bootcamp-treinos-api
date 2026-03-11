import { FastifyRequest, FastifyReply } from "fastify";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { UnauthorizedError } from "../errors/unauthorized-error.js";
import { getWorkoutDayParams } from "../schemas/workout-plan.schema.js";
import { makeGetWorkoutDay } from "../usecases/factories/make-get-workout-day.js";

export class GetWorkoutDayController {
  async handle(
    request: FastifyRequest<{ Params: getWorkoutDayParams }>,
    reply: FastifyReply,
  ) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      throw new UnauthorizedError();
    }

    const workoutDay = await makeGetWorkoutDay().execute({
      userId: session.user.id,
      workoutPlanId: request.params.workoutPlanId,
      workoutDayId: request.params.workoutDayId,
    });

    return reply.status(200).send(workoutDay);
  }
}
