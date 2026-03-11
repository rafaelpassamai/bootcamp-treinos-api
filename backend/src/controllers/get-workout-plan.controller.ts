import { FastifyRequest, FastifyReply } from "fastify";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { UnauthorizedError } from "../errors/unauthorized-error.js";
import { makeGetWorkoutPlan } from "../usecases/factories/make-get-workout-plan.js";
import { getWorkoutPlanParams } from "../schemas/workout-plan.schema.js";

export class GetWorkoutPlanController {
  async handle(
    request: FastifyRequest<{ Params: getWorkoutPlanParams }>,
    reply: FastifyReply,
  ) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      throw new UnauthorizedError();
    }

    const workoutPlan = await makeGetWorkoutPlan().execute({
      userId: session.user.id,
      workoutPlanId: request.params.workoutPlanId,
    });

    return reply.status(200).send(workoutPlan);
  }
}
