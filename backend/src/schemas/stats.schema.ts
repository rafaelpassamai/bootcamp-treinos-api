import { z } from "zod";

export const StatsQuerySchema = z.object({
  from: z.iso.date(),
  to: z.iso.date(),
});

export const getStatsResponseSchema = z.object({
  workoutStreak: z.number(),
  consistencyByDay: z.record(
    z.iso.date(),
    z.object({
      workoutDayCompleted: z.boolean(),
      workoutDayStarted: z.boolean(),
    })
  ),
  completedWorkoutsCount: z.number(),
  conclusionRate: z.number(),
  totalTimeInSeconds: z.number(),
});

export type StatsQuery = z.infer<typeof StatsQuerySchema>;
export type GetStatsResponse = z.infer<typeof getStatsResponseSchema>;