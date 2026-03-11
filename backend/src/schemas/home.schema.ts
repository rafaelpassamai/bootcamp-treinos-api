import { z } from "zod";
import { WeekDaySchema } from "../models/workout-day.model.js";

export const getHomeDataParamsSchema = z.object({
  date: z.string().min(1),
});

export const getHomeDataSchema = z.object({
  activeWorkoutPlanId: z.uuid().optional(),
  todayWorkoutDay: z
    .object({
      workoutPlanId: z.uuid(),
      id: z.uuid(),
      name: z.string(),
      isRest: z.boolean(),
      weekDay: z.enum(WeekDaySchema.options),
      estimatedDurationInSeconds: z.number(),
      coverImageUrl: z.url().optional(),
      exercisesCount: z.number(),
    })
    .optional(),
  workoutStreak: z.number(),
  consistencyByDay: z.record(
    z.iso.date(),
    z.object({
      workoutDayCompleted: z.boolean(),
      workoutDayStarted: z.boolean(),
    }),
  ),
});

export type getHomeDataParams = z.infer<typeof getHomeDataParamsSchema>;
export type getHomeDataResponse = z.infer<typeof getHomeDataSchema>;
