import {z} from "zod";

export const updateWorkoutSessionParamsSchema = z.object({
  workoutPlanId: z.uuid(),
  workoutDayId: z.uuid(),
  sessionId: z.uuid(),
});

export const updateWorkoutSessionBodySchema = z.object({
  completedAt: z.iso.datetime(),
});

export const updateWorkoutSessionResponseSchema = z.object({
  id: z.uuid(),
  startedAt: z.iso.datetime(),
  completedAt: z.iso.datetime(),
});

export type UpdateWorkoutSessionParams = z.infer<typeof updateWorkoutSessionParamsSchema>;
export type UpdateWorkoutSessionBody = z.infer<typeof updateWorkoutSessionBodySchema>;
export type UpdateWorkoutSessionResponse = z.infer<typeof updateWorkoutSessionResponseSchema>;