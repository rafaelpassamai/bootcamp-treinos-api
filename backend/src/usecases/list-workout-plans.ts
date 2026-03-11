import { IWorkoutPlanRepository } from "../repositories/interfaces/workout-plan-repository-interface.js";
import { WeekDay } from "../models/workout-day.model.js";

interface InputDto {
  userId: string;
  active?: boolean;
}

interface OutputDto {
  id: string;
  name: string;
  isActive: boolean;
  workoutDays: Array<{
    id: string;
    name: string;
    weekDay: WeekDay;
    isRest: boolean;
    estimatedDurationInSeconds: number;
    coverImageUrl?: string;
    exercises?: Array<{
      id: string;
      order?: number;
      name?: string;
      sets?: number;
      reps?: number;
      restTimeInSeconds?: number;
    }>;
  }>;
}

export class ListWorkoutPlans {
  constructor(private readonly workoutPlanRepository: IWorkoutPlanRepository) {}

  async execute(dto: InputDto): Promise<OutputDto[]> {
    const workoutPlans = await this.workoutPlanRepository.findManyByUserId(
      dto.userId,
      dto.active,
    );

    return workoutPlans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      isActive: plan.isActive,
      workoutDays: plan.workoutDays.map((day) => ({
        id: day.id,
        name: day.name,
        weekDay: day.weekDay,
        isRest: day.isRest,
        estimatedDurationInSeconds: day.estimatedDurationInSeconds,
        coverImageUrl: day.coverImageUrl ?? undefined,
        exercises: day.exercises.map((exercise) => ({
          id: exercise.id,
          order: exercise.order,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          restTimeInSeconds: exercise.restTimeInSeconds,
        })),
      })),
    }));
  }
}
