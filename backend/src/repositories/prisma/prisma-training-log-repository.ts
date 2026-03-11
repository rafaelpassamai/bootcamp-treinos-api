import { prisma } from "../../lib/db.js";
import { ITrainingLogRepository } from "../interfaces/training-log-repository-interface.js";
import { TrainingLog } from "../../models/training-log.model.js";

export class PrismaTrainingLogRepository implements ITrainingLogRepository {
  async create(trainingLog: TrainingLog): Promise<void> {
    await prisma.trainingLog.create({
      data: {
        id: trainingLog.id,
        userId: trainingLog.userId,
        name: trainingLog.name,
        description: trainingLog.description,
        createdAt: trainingLog.createdAt,
        updatedAt: trainingLog.updatedAt,
      },
    });
  }

  async findManyByUserId(userId: string): Promise<TrainingLog[]> {
    const logs = await prisma.trainingLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return logs.map((log) =>
      TrainingLog.restore({
        ...log,
        description: log.description ?? undefined,
      }),
    );
  }

  async findById(id: string): Promise<TrainingLog | null> {
    const log = await prisma.trainingLog.findUnique({
      where: { id },
    });

    if (!log) return null;

    return TrainingLog.restore({
      ...log,
      description: log.description ?? undefined,
    });
  }

  async findManyByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<TrainingLog[]> {
    const logs = await prisma.trainingLog.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return logs.map((log) =>
      TrainingLog.restore({
        ...log,
        description: log.description ?? undefined,
      }),
    );
  }
}
