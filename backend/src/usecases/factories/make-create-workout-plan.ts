import { CreateWorkoutPlan } from "../create-workout-plan.js";
import { PrismaWorkoutPlanRepository } from "../../repositories/prisma/prisma-workout-plan-repository.js";

export function makeCreateWorkoutPlan() {
  const repository = new PrismaWorkoutPlanRepository();
  return new CreateWorkoutPlan(repository);
}
