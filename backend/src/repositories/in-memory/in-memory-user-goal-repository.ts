import { IUserGoalRepository } from "../interfaces/user-goal-repository-interface.js";
import { UserGoal } from "../../models/user-goal.model.js";

export class InMemoryUserGoalRepository implements IUserGoalRepository {
  public items: UserGoal[] = [];

  async create(userGoal: UserGoal): Promise<void> {
    this.items.push(userGoal);
  }

  async findManyByUserId(userId: string): Promise<UserGoal[]> {
    return this.items
      .filter((goal) => goal.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<UserGoal | null> {
    return this.items.find((goal) => goal.id === id) ?? null;
  }

  async save(userGoal: UserGoal): Promise<void> {
    const index = this.items.findIndex((goal) => goal.id === userGoal.id);
    if (index !== -1) {
      this.items[index] = userGoal;
    }
  }
}
