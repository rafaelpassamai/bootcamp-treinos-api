import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { IWorkoutPlanRepository } from "../repositories/interfaces/workout-plan-repository-interface.js";
import { IWorkoutSessionRepository } from "../repositories/interfaces/workout-session-repository-interface.js";
import { ITrainingLogRepository } from "../repositories/interfaces/training-log-repository-interface.js";
import { WorkoutStreakCalculator } from "../services/workout-streak-calculator.js";

dayjs.extend(utc);

interface InputDto {
  userId: string;
  from: string;
  to: string;
}

interface OutputDto {
  workoutStreak: number;
  consistencyByDay: Record<
    string,
    {
      workoutDayCompleted: boolean;
      workoutDayStarted: boolean;
    }
  >;
  completedWorkoutsCount: number;
  conclusionRate: number;
  totalTimeInSeconds: number;
}

export class GetStats {
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
    const fromDate = dayjs.utc(dto.from).startOf("day");
    const toDate = dayjs.utc(dto.to).endOf("day");

    const workoutPlan =
      await this.workoutPlanRepository.findActiveWorkoutPlanWithDaysAndSessionsByUserId(
        dto.userId,
      );

    const [sessions, trainingLogs] = await Promise.all([
      workoutPlan
        ? this.workoutSessionRepository.findManyByWorkoutPlanIdAndDateRange(
            workoutPlan.id,
            fromDate.toDate(),
            toDate.toDate(),
          )
        : Promise.resolve([]),
      this.trainingLogRepository.findManyByUserIdAndDateRange(
        dto.userId,
        fromDate.toDate(),
        toDate.toDate(),
      ),
    ]);

    const consistencyByDay: Record<
      string,
      { workoutDayCompleted: boolean; workoutDayStarted: boolean }
    > = {};

    sessions.forEach((session) => {
      const dateKey = dayjs.utc(session.startedAt).format("YYYY-MM-DD");
      if (!consistencyByDay[dateKey]) {
        consistencyByDay[dateKey] = {
          workoutDayCompleted: false,
          workoutDayStarted: false,
        };
      }
      consistencyByDay[dateKey].workoutDayStarted = true;
      if (session.completedAt !== null) {
        consistencyByDay[dateKey].workoutDayCompleted = true;
      }
    });

    trainingLogs.forEach((log) => {
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

    const completedSessions = sessions.filter((s) => s.completedAt !== null);
    const completedWorkoutsCount = completedSessions.length;
    const conclusionRate =
      sessions.length > 0 ? completedWorkoutsCount / sessions.length : 0;

    const totalTimeInSeconds = completedSessions.reduce((total, session) => {
      const start = dayjs.utc(session.startedAt);
      const end = dayjs.utc(session.completedAt!);
      return total + end.diff(start, "second");
    }, 0);

    const workoutStreak = workoutPlan
      ? await this.streakCalculator.calculate(
          workoutPlan.id,
          dto.userId,
          workoutPlan.workoutDays,
          toDate,
        )
      : 0;

    return {
      workoutStreak,
      consistencyByDay,
      completedWorkoutsCount,
      conclusionRate,
      totalTimeInSeconds,
    };
  }
}
