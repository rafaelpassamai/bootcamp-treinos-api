import { PrismaWorkoutPlanRepository } from "../../repositories/prisma/prisma-workout-plan-repository.js";
import { PrismaWorkoutSessionRepository } from "../../repositories/prisma/prisma-workout-session-repository.js";
import { GetWorkoutDay } from "../get-workout-day.js";

export function makeGetWorkoutDay() {
  const workoutPlanRepository = new PrismaWorkoutPlanRepository();
  const workoutSessionRepository = new PrismaWorkoutSessionRepository();
  return new GetWorkoutDay(workoutSessionRepository, workoutPlanRepository);
}
