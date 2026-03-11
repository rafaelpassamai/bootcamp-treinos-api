import { StartWorkoutSession } from "../../usecases/start-workout-session.js";
import { PrismaWorkoutSessionRepository } from "../../repositories/prisma/prisma-workout-session-repository.js";
import { PrismaWorkoutPlanRepository } from "../../repositories/prisma/prisma-workout-plan-repository.js";

export function makeStartWorkoutSession() {
  const workoutSessionRepository = new PrismaWorkoutSessionRepository();
  const workoutPlanRepository = new PrismaWorkoutPlanRepository();
  return new StartWorkoutSession(
    workoutSessionRepository,
    workoutPlanRepository,
  );
}
