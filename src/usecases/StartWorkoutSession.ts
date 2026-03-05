import {
  ConflictError,
  NotFoundError,
  WorkoutPlanNotActiveError,
} from "../errors/index.js";
import { prisma } from "../lib/db.js";

interface Input {
  userId: string;
  planId: string;
  dayId: string;
}

interface Output {
  userWorkoutSessionId: string;
}

export class StartWorkoutSession {
  async execute({ userId, planId, dayId }: Input): Promise<Output> {
    // Load workout plan and verify ownership
    const workoutPlan = await prisma.workoutPlan.findUnique({
      where: { id: planId },
    });

    if (!workoutPlan || workoutPlan.userId !== userId) {
      throw new NotFoundError("Workout plan not found");
    }

    if (!workoutPlan.isActive) {
      throw new WorkoutPlanNotActiveError();
    }

    // Verify day belongs to plan
    const workoutDay = await prisma.workoutDay.findFirst({
      where: { id: dayId, workoutPlanId: planId },
    });

    if (!workoutDay) {
      throw new NotFoundError("Workout day not found");
    }

    // Check existing started session for this day (ongoing session)
    const existingSession = await prisma.workoutSession.findFirst({
      where: {
        workoutDayId: dayId,
        // Find any session for this day that hasn't been completed yet
        completedAt: null,
      },
    });

    if (existingSession) {
      throw new ConflictError("Workout session already started for this day");
    }

    // Create new session
    const created = await prisma.workoutSession.create({
      data: {
        workoutDayId: dayId,
        startedAt: new Date(),
      },
    });

    return { userWorkoutSessionId: created.id };
  }
}

export type {
  Input as StartWorkoutSessionInput,
  Output as StartWorkoutSessionOutput,
};
