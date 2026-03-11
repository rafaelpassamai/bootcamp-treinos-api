import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { IWorkoutSessionRepository } from "../repositories/interfaces/workout-session-repository-interface.js";
import { ITrainingLogRepository } from "../repositories/interfaces/training-log-repository-interface.js";
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

interface WorkoutDayInfo {
  weekDay: WeekDay;
  isRest: boolean;
}

export class WorkoutStreakCalculator {
  constructor(
    private readonly workoutSessionRepository: IWorkoutSessionRepository,
    private readonly trainingLogRepository: ITrainingLogRepository,
  ) {}

  async calculate(
    workoutPlanId: string,
    userId: string,
    workoutDays: WorkoutDayInfo[],
    currentDate: dayjs.Dayjs,
  ): Promise<number> {
    const planWeekDays = new Set(workoutDays.map((d) => d.weekDay));
    const restWeekDays = new Set(
      workoutDays.filter((d) => d.isRest).map((d) => d.weekDay),
    );

    const [completedSessions, trainingLogs] = await Promise.all([
      this.workoutSessionRepository.findAllCompletedByWorkoutPlanId(
        workoutPlanId,
      ),
      this.trainingLogRepository.findManyByUserId(userId),
    ]);

    const completedDates = new Set([
      ...completedSessions.map((s) =>
        dayjs.utc(s.startedAt).format("YYYY-MM-DD"),
      ),
      ...trainingLogs.map((log) =>
        dayjs.utc(log.createdAt).format("YYYY-MM-DD"),
      ),
    ]);

    let streak = 0;
    let day = currentDate;

    for (let i = 0; i < 365; i++) {
      const weekDay = WEEKDAY_MAP[day.day()];

      if (!planWeekDays.has(weekDay)) {
        day = day.subtract(1, "day");
        continue;
      }

      if (restWeekDays.has(weekDay)) {
        streak++;
        day = day.subtract(1, "day");
        continue;
      }

      const dateKey = day.format("YYYY-MM-DD");
      if (completedDates.has(dateKey)) {
        streak++;
        day = day.subtract(1, "day");
        continue;
      }

      break;
    }

    return streak;
  }
}
