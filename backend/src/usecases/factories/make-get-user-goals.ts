import { GetUserGoals } from "../get-user-goals.js";
import { PrismaUserGoalRepository } from "../../repositories/prisma/prisma-user-goal-repository.js";

export function makeGetUserGoals() {
  const repository = new PrismaUserGoalRepository();
  return new GetUserGoals(repository);
}
