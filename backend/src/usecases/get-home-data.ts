import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { IWorkoutPlanRepository } from "../repositories/interfaces/workout-plan-repository-interface.js";
import { IWorkoutSessionRepository } from "../repositories/interfaces/workout-session-repository-interface.js";
import { ITrainingLogRepository } from "../repositories/interfaces/training-log-repository-interface.js";
import { WorkoutStreakCalculator } from "../services/workout-streak-calculator.js";
import { WeekDay } from "../models/workout-day.model.js";

dayjs.extend(utc);

const WEEKDAY_MAP: Record<number, WeekDay> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

interface InputDto {
  userId: string;
  date: string;
}

interface OutputDto {
  activeWorkoutPlanId?: string;
  todayWorkoutDay?: {
    workoutPlanId: string;
    id: string;
    name: string;
    isRest: boolean;
    weekDay: WeekDay;
    estimatedDurationInSeconds: number;
    coverImageUrl?: string;
    exercisesCount: number;
  };
  workoutStreak: number;
  consistencyByDay: Record<
    string,
    {
      workoutDayCompleted: boolean;
      workoutDayStarted: boolean;
    }
  >;
}

export class GetHomeData {
  private readonly streakCalculator: WorkoutStreakCalculator;

  constructor(
    private readonly workoutPlanRepository: IWorkoutPlanRepository,
    private readonly workoutSessionRepository: IWorkoutSessionRepository,
    private readonly trainingLogRepository: ITrainingLogRepository,
  ) {
    this.streakCalculator = new WorkoutStreakCalculator(
      workoutSessionRepository,
      trainingLogRepository,
    );
  }

  async execute(dto: InputDto): Promise<OutputDto> {
    const currentDate = dayjs.utc(dto.date);

    const workoutPlan =
      await this.workoutPlanRepository.findActiveWorkoutPlanWithDaysAndSessionsByUserId(
        dto.userId,
      );

    const todayWeekDay = WEEKDAY_MAP[currentDate.day()];
    const todayWorkoutDay = workoutPlan?.workoutDays.find(
      (day) => day.weekDay === todayWeekDay,
    );

    const weekStart = currentDate.day(0).startOf("day");
    const weekEnd = currentDate.day(6).endOf("day");

    const weekSessions = workoutPlan
      ? await this.workoutSessionRepository.findManyByWorkoutPlanIdAndDateRange(
          workoutPlan.id,
          weekStart.toDate(),
          weekEnd.toDate(),
        )
      : [];

    const consistencyByDay: Record<
      string,
      {
        workoutDayCompleted: boolean;
        workoutDayStarted: boolean;
      }
    > = {};

    for (let i = 0; i < 7; i++) {
      const day = weekStart.add(i, "day");
      const dateKey = day.format("YYYY-MM-DD");

      const daySessions = weekSessions.filter(
        (s) => dayjs.utc(s.startedAt).format("YYYY-MM-DD") === dateKey,
      );

      consistencyByDay[dateKey] = {
        workoutDayStarted: daySessions.length > 0,
        workoutDayCompleted: daySessions.some((s) => s.completedAt !== null),
      };
    }

    const weekLogs =
      await this.trainingLogRepository.findManyByUserIdAndDateRange(
        dto.userId,
        weekStart.toDate(),
        weekEnd.toDate(),
      );

    weekLogs.forEach((log) => {
      const dateKey = dayjs.utc(log.createdAt).format("YYYY-MM-DD");
      if (!consistencyByDay[dateKey]) {
        consistencyByDay[dateKey] = {
          workoutDayCompleted: false,
          workoutDayStarted: false,
        };
      }
      consistencyByDay[dateKey].workoutDayStarted = true;
      consistencyByDay[dateKey].workoutDayCompleted = true;
    });

    const workoutStreak = workoutPlan
      ? await this.streakCalculator.calculate(
          workoutPlan.id,
          dto.userId,
          workoutPlan.workoutDays,
          currentDate,
        )
      : 0;

    return {
      activeWorkoutPlanId: workoutPlan?.id,
      todayWorkoutDay:
        todayWorkoutDay && workoutPlan
          ? {
              workoutPlanId: workoutPlan.id,
              id: todayWorkoutDay.id,
              name: todayWorkoutDay.name,
              isRest: todayWorkoutDay.isRest,
              weekDay: todayWorkoutDay.weekDay,
              estimatedDurationInSeconds:
                todayWorkoutDay.estimatedDurationInSeconds,
              coverImageUrl: todayWorkoutDay.coverImageUrl ?? undefined,
              exercisesCount: todayWorkoutDay.exercises.length,
            }
          : undefined,
      workoutStreak,
      consistencyByDay,
    };
  }
}
