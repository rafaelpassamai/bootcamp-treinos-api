import { FastifyRequest, FastifyReply } from "fastify";
import { makeGetStats } from "../usecases/factories/make-get-stats.js";
import { UnauthorizedError } from "../errors/unauthorized-error.js";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { StatsQuery } from "../schemas/stats.schema.js";

export class GetStatsController {
  async handle(
    request: FastifyRequest<{ Querystring: StatsQuery }>,
    reply: FastifyReply,
  ) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      throw new UnauthorizedError();
    }

    const result = await makeGetStats().execute({
      userId: session.user.id,
      from: request.query.from,
      to: request.query.to,
    });

    return reply.status(200).send(result);
  }
}
