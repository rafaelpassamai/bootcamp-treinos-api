import { CreateUserGoal } from "../create-user-goal.js";
import { PrismaUserGoalRepository } from "../../repositories/prisma/prisma-user-goal-repository.js";

export function makeCreateUserGoal() {
  const repository = new PrismaUserGoalRepository();
  return new CreateUserGoal(repository);
}
