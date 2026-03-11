import { IUserGoalRepository } from "../repositories/interfaces/user-goal-repository-interface.js";
import { NotFoundError } from "../errors/not-found-error.js";

interface InputDto {
  userId: string;
  goalId: string;
}

interface OutputDto {
  id: string;
  title: string;
  currentValue?: string;
  targetValue?: string;
  completedAt?: Date;
  updatedAt: Date;
}

export class CompleteUserGoal {
  constructor(private readonly repository: IUserGoalRepository) {}

  async execute(dto: InputDto): Promise<OutputDto> {
    const goal = await this.repository.findById(dto.goalId);

    if (!goal || goal.userId !== dto.userId) {
      throw new NotFoundError("Goal not found");
    }

    goal.complete();

    await this.repository.save(goal);

    return {
      id: goal.id,
      title: goal.title,
      currentValue: goal.currentValue,
      targetValue: goal.targetValue,
      completedAt: goal.completedAt,
      updatedAt: goal.updatedAt,
    };
  }
}
