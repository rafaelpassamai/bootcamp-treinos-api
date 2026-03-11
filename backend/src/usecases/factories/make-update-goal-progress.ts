import { UpdateGoalProgress } from "../update-goal-progress.js";
import { PrismaUserGoalRepository } from "../../repositories/prisma/prisma-user-goal-repository.js";

export function makeUpdateGoalProgress() {
  const repository = new PrismaUserGoalRepository();
  return new UpdateGoalProgress(repository);
}
