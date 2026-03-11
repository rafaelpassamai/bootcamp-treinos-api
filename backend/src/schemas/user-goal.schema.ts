import { z } from "zod";

export const CreateUserGoalBodySchema = z.object({
  title: z.string().trim().min(1),
  currentValue: z.string().optional(),
  targetValue: z.string().optional(),
});

export const UpdateGoalProgressBodySchema = z.object({
  currentValue: z.string().trim().min(1),
});

export const UserGoalResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  currentValue: z.string().optional(),
  targetValue: z.string().optional(),
  completedAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CreateUserGoalBody = z.infer<typeof CreateUserGoalBodySchema>;
export type UpdateGoalProgressBody = z.infer<
  typeof UpdateGoalProgressBodySchema
>;
export type UserGoalResponse = z.infer<typeof UserGoalResponseSchema>;
