import { z } from "zod";

export const startWorkoutSessionParamsSchema = z.object({
  workoutPlanId: z.uuid(),
  workoutDayId: z.uuid(),
});

export const startWorkoutSessionResponseSchema = z.object({
  userWorkoutSessionId: z.uuid(),
});

export type StartWorkoutSessionParams = z.infer<
  typeof startWorkoutSessionParamsSchema
>;
