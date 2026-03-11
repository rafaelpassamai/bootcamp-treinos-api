import { prisma } from "../../lib/db.js";
import { IWorkoutSessionRepository } from "../interfaces/workout-session-repository-interface.js";
import { WorkoutSession } from "../../models/workout-session.js";

export class PrismaWorkoutSessionRepository implements IWorkoutSessionRepository {
  async findWorkoutSessionByWorkoutDayId(
    workoutDayId: string,
  ): Promise<WorkoutSession | null> {
    const workoutSession = await prisma.workoutSession.findFirst({
      where: { workoutDayId },
    });

    if (!workoutSession) return null;

    return WorkoutSession.restore({
      ...workoutSession,
    });
  }

  async findManyByWorkoutPlanIdAndDateRange(
    workoutPlanId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<WorkoutSession[]> {
    const sessions = await prisma.workoutSession.findMany({
      where: {
        workoutDay: { workoutPlanId },
        startedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return sessions.map((session) => WorkoutSession.restore({ ...session }));
  }

  async findAllCompletedByWorkoutPlanId(
    workoutPlanId: string,
  ): Promise<WorkoutSession[]> {
    const sessions = await prisma.workoutSession.findMany({
      where: {
        workoutDay: { workoutPlanId },
        completedAt: { not: null },
      },
    });

    return sessions.map((session) => WorkoutSession.restore({ ...session }));
  }

  async getWorkoutSessionsByWorkoutDayId(
    workoutDayId: string,
  ): Promise<WorkoutSession[]> {
    const sessions = await prisma.workoutSession.findMany({
      where: { workoutDayId },
    });

    return sessions.map((session) => WorkoutSession.restore({ ...session }));
  }

  async create(workoutSession: WorkoutSession): Promise<void> {
    await prisma.workoutSession.create({
      data: {
        workoutDayId: workoutSession.workoutDayId,
        startedAt: workoutSession.startedAt,
      },
    });
  }

  async save(workoutSession: WorkoutSession): Promise<void> {
    await prisma.workoutSession.update({
      where: { id: workoutSession.id },
      data: {
        workoutDayId: workoutSession.workoutDayId,
        startedAt: workoutSession.startedAt,
        completedAt: workoutSession.completedAt,
      },
    });
  }
}
