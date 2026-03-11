import { z } from "zod";

export const UpsertUserTrainDataBodySchema = z.object({
  weightInGrams: z.number().min(0),
  heightInCentimeters: z.number().min(0),
  age: z.number().min(0),
  bodyFatPercentage: z.number().min(0).max(100),
  gender: z.string().min(1),
});

export const UserTrainDataResponseSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  weightInGrams: z.number(),
  heightInCentimeters: z.number(),
  age: z.number(),
  bodyFatPercentage: z.number().min(0).max(100),
  gender: z.string(),
});

export type UpsertUserTrainDataBody = z.infer<
  typeof UpsertUserTrainDataBodySchema
>;
export type UserTrainDataResponse = z.infer<typeof UserTrainDataResponseSchema>;
