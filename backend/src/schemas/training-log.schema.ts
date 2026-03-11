import { z } from "zod";

export const CreateTrainingLogBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export const TrainingLogResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
});

export type CreateTrainingLogBody = z.infer<typeof CreateTrainingLogBodySchema>;
export type TrainingLogResponse = z.infer<typeof TrainingLogResponseSchema>;
