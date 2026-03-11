// src/controllers/me.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { UnauthorizedError } from "../errors/unauthorized-error.js";
import { makeGetUserTrainData } from "../usecases/factories/make-get-user-train-data.js";
import { makeUpsertUserTrainData } from "../usecases/factories/make-upsert-user-train-data.js";
import { UpsertUserTrainDataBody } from "../schemas/me.schema.js";

export class MeController {
  async get(request: FastifyRequest, reply: FastifyReply) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      throw new UnauthorizedError();
    }

    const result = await makeGetUserTrainData().execute({
      userId: session.user.id,
    });

    return reply.status(200).send(result);
  }

  async upsert(
    request: FastifyRequest<{ Body: UpsertUserTrainDataBody }>,
    reply: FastifyReply,
  ) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      throw new UnauthorizedError();
    }

    const result = await makeUpsertUserTrainData().execute({
      userId: session.user.id,
      weightInGrams: request.body.weightInGrams,
      heightInCentimeters: request.body.heightInCentimeters,
      age: request.body.age,
      bodyFatPercentage: request.body.bodyFatPercentage,
      gender: request.body.gender,
    });

    return reply.status(200).send(result);
  }
}
