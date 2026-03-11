import { UserGoal } from "../../models/user-goal.model.js";

export interface IUserGoalRepository {
  create(userGoal: UserGoal): Promise<void>;
  findManyByUserId(userId: string): Promise<UserGoal[]>;
  findById(id: string): Promise<UserGoal | null>;
  save(userGoal: UserGoal): Promise<void>;
}
