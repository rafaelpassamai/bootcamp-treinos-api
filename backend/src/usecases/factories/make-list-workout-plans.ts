import { ListWorkoutPlans } from "../list-workout-plans.js";
import { PrismaWorkoutPlanRepository } from "../../repositories/prisma/prisma-workout-plan-repository.js";

export function makeListWorkoutPlans() {
  const workoutPlanRepository = new PrismaWorkoutPlanRepository();
  return new ListWorkoutPlans(workoutPlanRepository);
}
