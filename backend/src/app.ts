import Fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod";
import fastifySwagger from "@fastify/swagger";
import fastifyApiReference from "@scalar/fastify-api-reference";
import { auth } from "./lib/auth.js";
import fastifyCors from "@fastify/cors";
import { errorHandler } from "./lib/error-handler.js";
import { workoutPlanRoutes } from "./routes/workout-plans.routes.js";
import { homeRoutes } from "./routes/home.routes.js";
import { statsRoutes } from "./routes/stats.routes.js";
import { aiRoutes } from "./routes/ai.routes.js";
import { meRoutes } from "./routes/me.routes.js";
import { env } from "./env/index.js";
import { trainingLogRoutes } from "./routes/training-logs.routes.js";
import { userGoalRoutes } from "./routes/user-goals.routes.js";

const envToLogger = {
  dev: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  prod: true,
  test: false,
};

const app = Fastify({
  logger: envToLogger[env.NODE_ENV],
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "API gerenciadora de treinos",
      description: "API para gerenciar treinos e exercícios",
      version: "1.0.0",
    },
    servers: [
      {
        description: "LocalHost",
        url: "http://localhost:3333",
      },
    ],
  },
  transform: jsonSchemaTransform,
});

await app.register(fastifyCors, {
  origin: [
    "http://localhost:3000",
    "https://gerenciador-de-atividades-fisicas-f.vercel.app",
  ],
  credentials: true,
});

if (env.NODE_ENV !== "prod") {
  await app.register(fastifyApiReference, {
    routePrefix: "/docs",
    configuration: {
      sources: [
        {
          title: "API gerenciadora de treinos",
          slug: "api-gerenciadora-de-treinos",
          url: "/swagger.json",
        },
        {
          title: "Auth API",
          slug: "auth-api",
          url: "/api/auth/open-api/generate-schema",
        },
      ],
    },
  });
}

await app.register(workoutPlanRoutes, { prefix: "/workout-plans" });
await app.register(homeRoutes, { prefix: "/home" });
await app.register(statsRoutes, { prefix: "/stats" });
await app.register(aiRoutes, { prefix: "/ai" });
await app.register(meRoutes, { prefix: "/me" });
await app.register(trainingLogRoutes, { prefix: "/training-logs" });
await app.register(userGoalRoutes, { prefix: "/user-goals" });

app.withTypeProvider<ZodTypeProvider>().route({
  method: "GET",
  url: "/swagger.json",
  schema: {
    hide: true,
  },
  handler: async () => {
    return app.swagger();
  },
});

app.get("/", async function handler() {
  return { message: "API is running 🚀" };
});

app.withTypeProvider<ZodTypeProvider>().route({
  method: "GET",
  url: "/health",
  schema: {
    description: "Health check endpoint",
    response: {
      200: z.object({
        status: z.string(),
      }),
    },
  },
  handler: () => {
    return { status: "API is running 🚀" };
  },
});

app.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  schema: {
    hide: true,
  },
  async handler(request, reply) {
    try {
      // Construct request URL
      const url = new URL(request.url, `http://${request.headers.host}`);

      // Convert Fastify headers to standard Headers object
      const headers = new Headers();
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value) headers.append(key, value.toString());
      });
      // Create Fetch API-compatible request
      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        ...(request.body ? { body: JSON.stringify(request.body) } : {}),
      });
      // Process authentication request
      const response = await auth.handler(req);
      // Forward response to client
      reply.status(response.status);
      response.headers.forEach((value, key) => reply.header(key, value));
      reply.send(response.body ? await response.text() : null);
    } catch (error) {
      app.log.error(error);
      reply.status(500).send({
        error: "Internal authentication error",
        code: "AUTH_FAILURE",
      });
    }
  },
});

app.register(errorHandler);

export { app };
