import { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";
import { FastifyInstance } from "fastify";

export function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, _request, reply) => {
    if (process.env.NODE_ENV !== "prod") {
      app.log.error(error);
    }

    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: "Validation error",
        code: "VALIDATION_ERROR",
        issues: error.issues.map((issue) => issue.message).join(", "),
      });
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: error.message,
        code: error.code,
      });
    }

    return reply.status(500).send({
      error: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
    });
  });
}
