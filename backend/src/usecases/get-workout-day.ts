import { NotFoundError } from "../errors/not-found-error.js";
import { IWorkoutPlanRepository } from "../repositories/interfaces/workout-plan-repository-interface.js";
import { IWorkoutSessionRepository } from "../repositories/interfaces/workout-session-repository-interface.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { WeekDay } from "../models/workout-day.model.js";

dayjs.extend(utc);

interface InputDto {
  userId: string;
  workoutPlanId: string;
  workoutDayId: string;
}

interface OutputDto {
  id: string;
  name: string;
  isRest: boolean;
  coverImageUrl?: string | undefined;
  estimatedDurationInSeconds: number;
  weekDay: WeekDay;
  exercises: Array<{
    id: string;
    name: string;
    order?: number;
    workoutDayId: string;
    sets?: number;
    reps?: number;
    restTimeInSeconds?: number;
  }>;
  workoutSessions: Array<{
    id: string;
    workoutDayId: string;
    startedAt?: string;
    completedAt?: string;
  }>;
}

export class GetWorkoutDay {
  constructor(
    private readonly workoutSessionRepository: IWorkoutSessionRepository,
    private readonly workoutPlanRepository: IWorkoutPlanRepository,
  ) {}

  async execute(dto: InputDto): Promise<OutputDto> {
    const workoutPlan =
      await this.workoutPlanRepository.findActiveWorkoutPlanWithDaysAndSessionsByUserId(
        dto.userId,
      );

    if (!workoutPlan || workoutPlan.userId !== dto.userId) {
      throw new NotFoundError("Workout plan not found");
    }

    const workoutDay = workoutPlan.workoutDays.find(
      (day) => day.id === dto.workoutDayId,
    );

    if (!workoutDay) {
      throw new NotFoundError("Workout day not found");
    }

    const exercises = workoutDay.exercises.sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );

    const workoutSessions =
      await this.workoutSessionRepository.getWorkoutSessionsByWorkoutDayId(
        workoutDay.id,
      );

    if (!workoutSessions) {
      throw new NotFoundError("Workout session not found");
    }

    return {
      id: workoutDay.id,
      name: workoutDay.name,
      weekDay: workoutDay.weekDay,
      isRest: workoutDay.isRest,
      coverImageUrl: workoutDay.coverImageUrl ?? undefined,
      estimatedDurationInSeconds: workoutDay.estimatedDurationInSeconds,
      exercises: exercises.map((exercise) => ({
        id: exercise.id,
        order: exercise.order ?? undefined,
        workoutDayId: workoutDay.id,
        name: exercise.name,
        sets: exercise.sets ?? undefined,
        reps: exercise.reps ?? undefined,
        restTimeInSeconds: exercise.restTimeInSeconds ?? undefined,
      })),
      workoutSessions: workoutSessions.map((session) => ({
        id: session.id,
        workoutDayId: session.workoutDayId,
        startedAt: dayjs.utc(session.startedAt).format("YYYY-MM-DD"),
        completedAt: session.completedAt
          ? dayjs.utc(session.completedAt).format("YYYY-MM-DD")
          : undefined,
      })),
    };
  }
}
