import { FastifyRequest, FastifyReply } from "fastify";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { UnauthorizedError } from "../errors/unauthorized-error.js";
import { makeCreateUserGoal } from "../usecases/factories/make-create-user-goal.js";
import { makeGetUserGoals } from "../usecases/factories/make-get-user-goals.js";
import { makeUpdateGoalProgress } from "../usecases/factories/make-update-goal-progress.js";
import { makeCompleteUserGoal } from "../usecases/factories/make-complete-user-goal.js";
import {
  CreateUserGoalBody,
  UpdateGoalProgressBody,
} from "../schemas/user-goal.schema.js";

export class UserGoalController {
  async create(
    request: FastifyRequest<{ Body: CreateUserGoalBody }>,
    reply: FastifyReply,
  ) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });
    if (!session) throw new UnauthorizedError();

    const result = await makeCreateUserGoal().execute({
      userId: session.user.id,
      ...request.body,
    });

    return reply.status(201).send(result);
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });
    if (!session) throw new UnauthorizedError();

    const result = await makeGetUserGoals().execute({
      userId: session.user.id,
    });

    return reply.status(200).send(result);
  }

  async updateProgress(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateGoalProgressBody;
    }>,
    reply: FastifyReply,
  ) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });
    if (!session) throw new UnauthorizedError();

    const result = await makeUpdateGoalProgress().execute({
      userId: session.user.id,
      goalId: request.params.id,
      currentValue: request.body.currentValue,
    });

    return reply.status(200).send(result);
  }

  async complete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });
    if (!session) throw new UnauthorizedError();

    const result = await makeCompleteUserGoal().execute({
      userId: session.user.id,
      goalId: request.params.id,
    });

    return reply.status(200).send(result);
  }
}
