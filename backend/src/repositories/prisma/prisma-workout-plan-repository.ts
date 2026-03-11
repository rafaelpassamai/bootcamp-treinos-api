import { prisma } from "../../lib/db.js";
import { IWorkoutPlanRepository } from "../interfaces/workout-plan-repository-interface.js";
import { WorkoutPlan } from "../../models/workout-plan.model.js";
import { WorkoutDay } from "../../models/workout-day.model.js";
import { WorkoutExercise } from "../../models/workout-exercise.model.js";

export class PrismaWorkoutPlanRepository implements IWorkoutPlanRepository {
  async findManyByUserId(
    userId: string,
    active?: boolean,
  ): Promise<WorkoutPlan[]> {
    const workoutPlans = await prisma.workoutPlan.findMany({
      where: {
        userId,
        ...(active !== undefined ? { isActive: active } : {}),
      },
      include: {
        workoutDays: {
          include: {
            exercises: { orderBy: { order: "asc" } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return workoutPlans.map((plan) =>
      WorkoutPlan.restore({
        ...plan,
        workoutDays: plan.workoutDays.map((day) =>
          WorkoutDay.restore({
            ...day,
            exercises: day.exercises.map((exercise) =>
              WorkoutExercise.restore({
                ...exercise,
                sets: exercise.sets ?? undefined,
                reps: exercise.reps ?? undefined,
                restTimeInSeconds: exercise.restTimeInSeconds ?? undefined,
                order: exercise.order ?? undefined,
              }),
            ),
          }),
        ),
      }),
    );
  }

  async findWorkoutPlanById(id: string): Promise<WorkoutPlan | null> {
    const workoutPlan = await prisma.workoutPlan.findUnique({
      where: { id, isActive: true },
      include: {
        workoutDays: {
          include: {
            exercises: true,
          },
        },
      },
    });

    if (!workoutPlan) return null;

    return WorkoutPlan.restore({
      ...workoutPlan,
      workoutDays: workoutPlan.workoutDays.map((day) =>
        WorkoutDay.restore({
          ...day,
          exercises: day.exercises.map((exercise) =>
            WorkoutExercise.restore({
              ...exercise,
              sets: exercise.sets ?? undefined,
              reps: exercise.reps ?? undefined,
              restTimeInSeconds: exercise.restTimeInSeconds ?? undefined,
              order: exercise.order ?? undefined,
            }),
          ),
        }),
      ),
    });
  }

  async findWorkoutPlanByUserId(userId: string): Promise<WorkoutPlan | null> {
    const workoutPlan = await prisma.workoutPlan.findFirst({
      where: { userId, isActive: true },
      include: {
        workoutDays: {
          include: {
            exercises: true,
          },
        },
      },
    });

    if (!workoutPlan) return null;

    return WorkoutPlan.restore({
      ...workoutPlan,
      workoutDays: workoutPlan.workoutDays.map((day) =>
        WorkoutDay.restore({
          ...day,
          exercises: day.exercises.map((exercise) =>
            WorkoutExercise.restore({
              ...exercise,
              sets: exercise.sets ?? undefined,
              reps: exercise.reps ?? undefined,
              restTimeInSeconds: exercise.restTimeInSeconds ?? undefined,
              order: exercise.order ?? undefined,
            }),
          ),
        }),
      ),
    });
  }

  async findActiveWorkoutPlanWithDaysAndSessionsByUserId(
    userId: string,
  ): Promise<WorkoutPlan | null> {
    const workoutPlan = await prisma.workoutPlan.findFirst({
      where: { userId, isActive: true },
      include: {
        workoutDays: {
          include: {
            exercises: true,
            sessions: true,
          },
        },
      },
    });

    if (!workoutPlan) return null;

    return WorkoutPlan.restore({
      ...workoutPlan,
      workoutDays: workoutPlan.workoutDays.map(({ sessions, ...day }) =>
        WorkoutDay.restore({
          ...day,
          exercises: day.exercises.map((exercise) =>
            WorkoutExercise.restore({
              ...exercise,
              sets: exercise.sets ?? undefined,
              reps: exercise.reps ?? undefined,
              restTimeInSeconds: exercise.restTimeInSeconds ?? undefined,
              order: exercise.order ?? undefined,
            }),
          ),
        }),
      ),
    });
  }

  async create(workoutPlan: WorkoutPlan): Promise<void> {
    await prisma.workoutPlan.create({
      data: {
        id: workoutPlan.id,
        name: workoutPlan.name,
        userId: workoutPlan.userId,
        isActive: workoutPlan.isActive,
        createdAt: workoutPlan.createdAt,
        updatedAt: workoutPlan.updatedAt,
        workoutDays: {
          create: workoutPlan.workoutDays.map((day) => ({
            id: day.id,
            name: day.name,
            weekDay: day.weekDay,
            isRest: day.isRest,
            estimatedDurationInSeconds: day.estimatedDurationInSeconds,
            coverImageUrl: day.coverImageUrl,
            exercises: {
              create: day.exercises.map((exercise) => ({
                id: exercise.id,
                name: exercise.name,
                order: exercise.order ?? undefined,
                sets: exercise.sets ?? undefined,
                reps: exercise.reps ?? undefined,
                restTimeInSeconds: exercise.restTimeInSeconds ?? undefined,
              })),
            },
          })),
        },
      },
    });
  }

  async save(workoutPlan: WorkoutPlan): Promise<void> {
    await prisma.workoutPlan.update({
      where: { id: workoutPlan.id },
      data: {
        isActive: workoutPlan.isActive,
        updatedAt: new Date(),
      },
    });
  }
}
