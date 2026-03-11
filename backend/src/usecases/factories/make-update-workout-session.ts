import { PrismaWorkoutSessionRepository } from "../../repositories/prisma/prisma-workout-session-repository.js";
import { PrismaWorkoutPlanRepository } from "../../repositories/prisma/prisma-workout-plan-repository.js";
import { UpdateWorkoutSession } from "../update-workout-session.js";

export function makeUpdateWorkoutSession() {
  const workoutSessionRepository = new PrismaWorkoutSessionRepository();
  const workoutPlanRepository = new PrismaWorkoutPlanRepository();
  return new UpdateWorkoutSession(
    workoutSessionRepository,
    workoutPlanRepository,
  );
}
