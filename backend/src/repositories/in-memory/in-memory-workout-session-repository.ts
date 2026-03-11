import { WorkoutSession } from "../../models/workout-session.js";
import { IWorkoutSessionRepository } from "../interfaces/workout-session-repository-interface.js";
import { InMemoryWorkoutPlanRepository } from "./in-memory-workout-plan-repository.js";

export class InMemoryWorkoutSessionRepository implements IWorkoutSessionRepository {
  constructor(
    private readonly workoutPlanRepository: InMemoryWorkoutPlanRepository,
  ) {}
  public items: WorkoutSession[] = [];

  async findWorkoutSessionByWorkoutDayId(
    workoutDayId: string,
  ): Promise<WorkoutSession | null> {
    return (
      this.items.find((item) => item.workoutDayId === workoutDayId) ?? null
    );
  }

  async findManyByWorkoutPlanIdAndDateRange(
    workoutPlanId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<WorkoutSession[]> {
    const workoutDayIds =
      this.workoutPlanRepository.items
        .find((plan) => plan.id === workoutPlanId)
        ?.workoutDays.map((day) => day.id) ?? [];

    return this.items.filter((item) => {
      return (
        workoutDayIds.includes(item.workoutDayId) &&
        item.startedAt >= startDate &&
        item.startedAt <= endDate
      );
    });
  }

  async findAllCompletedByWorkoutPlanId(
    workoutPlanId: string,
  ): Promise<WorkoutSession[]> {
    const workoutDayIds =
      this.workoutPlanRepository.items
        .find((plan) => plan.id === workoutPlanId)
        ?.workoutDays.map((day) => day.id) ?? [];

    return this.items.filter((item) => {
      return (
        workoutDayIds.includes(item.workoutDayId) && item.completedAt !== null
      );
    });
  }

  async getWorkoutSessionsByWorkoutDayId(
    workoutDayId: string,
  ): Promise<WorkoutSession[]> {
    return this.items.filter((item) => item.workoutDayId === workoutDayId);
  }

  async create(workoutSession: WorkoutSession): Promise<void> {
    this.items.push(workoutSession);
  }

  async save(workoutSession: WorkoutSession): Promise<void> {
    const index = this.items.findIndex((item) => item.id === workoutSession.id);
    if (index !== -1) {
      this.items[index] = workoutSession;
    }
  }
}
