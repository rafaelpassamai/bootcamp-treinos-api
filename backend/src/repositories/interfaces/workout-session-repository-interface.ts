import { WorkoutSession } from "../../models/workout-session.js";

export interface IWorkoutSessionRepository {
  findWorkoutSessionByWorkoutDayId(
    workoutDayId: string,
  ): Promise<WorkoutSession | null>;

  findManyByWorkoutPlanIdAndDateRange(
    workoutPlanId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<WorkoutSession[]>;

  findAllCompletedByWorkoutPlanId(
    workoutPlanId: string,
  ): Promise<WorkoutSession[]>;

  getWorkoutSessionsByWorkoutDayId(
    workoutDayId: string,
  ): Promise<WorkoutSession[]>;

  create(workoutSession: WorkoutSession): Promise<void>;
  save(workoutSession: WorkoutSession): Promise<void>;
}
