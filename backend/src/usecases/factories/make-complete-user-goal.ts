import { CompleteUserGoal } from "../complete-user-goal.js";
import { PrismaUserGoalRepository } from "../../repositories/prisma/prisma-user-goal-repository.js";

export function makeCompleteUserGoal() {
  const repository = new PrismaUserGoalRepository();
  return new CompleteUserGoal(repository);
}
