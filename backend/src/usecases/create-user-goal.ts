import { IUserGoalRepository } from "../repositories/interfaces/user-goal-repository-interface.js";
import { UserGoal } from "../models/user-goal.model.js";

interface InputDto {
  userId: string;
  title: string;
  currentValue?: string;
  targetValue?: string;
}

interface OutputDto {
  id: string;
  userId: string;
  title: string;
  currentValue?: string;
  targetValue?: string;
  completedAt?: Date;
  createdAt: Date;
}

export class CreateUserGoal {
  constructor(private readonly repository: IUserGoalRepository) {}

  async execute(dto: InputDto): Promise<OutputDto> {
    const userGoal = UserGoal.create({
      userId: dto.userId,
      title: dto.title,
      currentValue: dto.currentValue,
      targetValue: dto.targetValue,
    });

    await this.repository.create(userGoal);

    return {
      id: userGoal.id,
      userId: userGoal.userId,
      title: userGoal.title,
      currentValue: userGoal.currentValue,
      targetValue: userGoal.targetValue,
      completedAt: userGoal.completedAt,
      createdAt: userGoal.createdAt,
    };
  }
}
