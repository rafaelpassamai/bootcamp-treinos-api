import { prisma } from "../../lib/db.js";
import { IUserGoalRepository } from "../interfaces/user-goal-repository-interface.js";
import { UserGoal } from "../../models/user-goal.model.js";

export class PrismaUserGoalRepository implements IUserGoalRepository {
  async create(userGoal: UserGoal): Promise<void> {
    await prisma.userGoal.create({
      data: {
        id: userGoal.id,
        userId: userGoal.userId,
        title: userGoal.title,
        currentValue: userGoal.currentValue,
        targetValue: userGoal.targetValue,
        completedAt: userGoal.completedAt,
        createdAt: userGoal.createdAt,
        updatedAt: userGoal.updatedAt,
      },
    });
  }

  async findManyByUserId(userId: string): Promise<UserGoal[]> {
    const goals = await prisma.userGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return goals.map((goal) =>
      UserGoal.restore({
        ...goal,
        currentValue: goal.currentValue ?? undefined,
        targetValue: goal.targetValue ?? undefined,
        completedAt: goal.completedAt ?? undefined,
      }),
    );
  }

  async findById(id: string): Promise<UserGoal | null> {
    const goal = await prisma.userGoal.findUnique({
      where: { id },
    });

    if (!goal) return null;

    return UserGoal.restore({
      ...goal,
      currentValue: goal.currentValue ?? undefined,
      targetValue: goal.targetValue ?? undefined,
      completedAt: goal.completedAt ?? undefined,
    });
  }

  async save(userGoal: UserGoal): Promise<void> {
    await prisma.userGoal.update({
      where: { id: userGoal.id },
      data: {
        currentValue: userGoal.currentValue,
        targetValue: userGoal.targetValue,
        completedAt: userGoal.completedAt,
        updatedAt: userGoal.updatedAt,
      },
    });
  }
}