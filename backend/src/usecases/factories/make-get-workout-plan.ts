import { PrismaWorkoutPlanRepository } from "../../repositories/prisma/prisma-workout-plan-repository.js";
import { GetWorkoutPlan } from "../get-workout-plan.js";

export function makeGetWorkoutPlan() {
  const workoutPlanRepository = new PrismaWorkoutPlanRepository();
  return new GetWorkoutPlan(workoutPlanRepository);
}
