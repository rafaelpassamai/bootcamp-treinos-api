import { IUserGoalRepository } from "../repositories/interfaces/user-goal-repository-interface.js";

interface InputDto {
  userId: string;
}

interface OutputDto {
  id: string;
  title: string;
  currentValue?: string;
  targetValue?: string;
  completedAt?: Date;
  createdAt: Date;
}

export class GetUserGoals {
  constructor(private readonly repository: IUserGoalRepository) {}

  async execute(dto: InputDto): Promise<OutputDto[]> {
    const goals = await this.repository.findManyByUserId(dto.userId);

    return goals.map((goal) => ({
      id: goal.id,
      title: goal.title,
      currentValue: goal.currentValue,
      targetValue: goal.targetValue,
      completedAt: goal.completedAt,
      createdAt: goal.createdAt,
    }));
  }
}