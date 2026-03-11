import { FastifyRequest, FastifyReply } from "fastify";
import {
  streamText,
  tool,
  stepCountIs,
  convertToModelMessages,
  UIMessage,
} from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { UnauthorizedError } from "../errors/unauthorized-error.js";
import { AppError } from "../errors/app-error.js";
import { makeGetUserTrainData } from "../usecases/factories/make-get-user-train-data.js";
import { makeUpsertUserTrainData } from "../usecases/factories/make-upsert-user-train-data.js";
import { makeListWorkoutPlans } from "../usecases/factories/make-list-workout-plans.js";
import { makeCreateWorkoutPlan } from "../usecases/factories/make-create-workout-plan.js";
import { SYSTEM_PROMPT } from "../lib/ai-prompt.js";
import { WeekDaySchema } from "../models/workout-day.model.js";
import { env } from "../env/index.js";

const gemini = createGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
});

export class AiController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      throw new UnauthorizedError();
    }
    if (!env.GEMINI_API_KEY) {
      throw new AppError(
        "GEMINI_API_KEY não configurada no backend.",
        503,
        "GEMINI_NOT_CONFIGURED",
      );
    }

    const userId = session.user.id;
    const { messages } = request.body as { messages: UIMessage[] };

    const result = streamText({
      model: gemini(env.GEMINI_MODEL),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      stopWhen: stepCountIs(10),
      tools: {
        getUserTrainData: tool({
          description:
            "Busca os dados de treino do usuário autenticado (peso, altura, idade, % gordura). Retorna null se não houver dados cadastrados.",
          inputSchema: z.object({}),
          execute: async () => {
            return makeGetUserTrainData().execute({ userId });
          },
        }),
        updateUserTrainData: tool({
          description:
            "Atualiza os dados de treino do usuário autenticado. O peso deve ser em gramas (converter kg * 1000).",
          inputSchema: z.object({
            weightInGrams: z
              .number()
              .describe("Peso do usuário em gramas (ex: 70kg = 70000)"),
            heightInCentimeters: z
              .number()
              .describe("Altura do usuário em centímetros"),
            age: z.number().describe("Idade do usuário"),
            bodyFatPercentage: z
              .number()
              .int()
              .min(0)
              .max(100)
              .describe("Percentual de gordura corporal (0 a 100)"),
            gender: z.string().describe("Genero do usuario"),
          }),
          execute: async (params) => {
            return makeUpsertUserTrainData().execute({ userId, ...params });
          },
        }),
        getWorkoutPlans: tool({
          description:
            "Lista todos os planos de treino do usuário autenticado.",
          inputSchema: z.object({}),
          execute: async () => {
            return makeListWorkoutPlans().execute({ userId });
          },
        }),
        createWorkoutPlan: tool({
          description: "Cria um novo plano de treino completo para o usuário.",
          inputSchema: z.object({
            name: z.string().describe("Nome do plano de treino"),
            workoutDays: z
              .array(
                z.object({
                  name: z
                    .string()
                    .describe("Nome do dia (ex: Peito e Tríceps, Descanso)"),
                  weekDay: z
                    .enum(WeekDaySchema.options)
                    .describe("Dia da semana"),
                  isRest: z
                    .boolean()
                    .describe("Se é dia de descanso (true) ou treino (false)"),
                  estimatedDurationInSeconds: z
                    .number()
                    .describe(
                      "Duração estimada em segundos (0 para dias de descanso)",
                    ),
                  coverImageUrl: z
                    .string()
                    .url()
                    .describe("URL da imagem de capa do dia de treino."),
                  exercises: z
                    .array(
                      z.object({
                        order: z.number().describe("Ordem do exercício no dia"),
                        name: z.string().describe("Nome do exercício"),
                        sets: z.number().describe("Número de séries"),
                        reps: z.number().describe("Número de repetições"),
                        restTimeInSeconds: z
                          .number()
                          .describe(
                            "Tempo de descanso entre séries em segundos",
                          ),
                      }),
                    )
                    .describe(
                      "Lista de exercícios (vazia para dias de descanso)",
                    ),
                }),
              )
              .describe(
                "Array com exatamente 7 dias de treino (MONDAY a SUNDAY)",
              ),
          }),
          execute: async (input) => {
            return makeCreateWorkoutPlan().execute({
              userId,
              name: input.name,
              workoutDays: input.workoutDays,
            });
          },
        }),
      },
    });

    const response = result.toUIMessageStreamResponse();
    reply.status(response.status);
    response.headers.forEach((value, key) => reply.header(key, value));
    return reply.send(response.body);
  }
}


