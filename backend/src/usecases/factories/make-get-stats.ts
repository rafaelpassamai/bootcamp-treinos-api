import { GetStats } from "../get-stats.js";
import { PrismaWorkoutPlanRepository } from "../../repositories/prisma/prisma-workout-plan-repository.js";
import { PrismaWorkoutSessionRepository } from "../../repositories/prisma/prisma-workout-session-repository.js";
import { PrismaTrainingLogRepository } from "../../repositories/prisma/prisma-training-log-repository.js";

export function makeGetStats() {
  const workoutPlanRepository = new PrismaWorkoutPlanRepository();
  const workoutSessionRepository = new PrismaWorkoutSessionRepository();
  const trainingLogRepository = new PrismaTrainingLogRepository();
  return new GetStats(
    workoutPlanRepository,
    workoutSessionRepository,
    trainingLogRepository,
  );
}
