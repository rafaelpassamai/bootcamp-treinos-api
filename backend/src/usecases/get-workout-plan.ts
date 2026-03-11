import { IWorkoutPlanRepository } from "../repositories/interfaces/workout-plan-repository-interface.js";
import { WeekDay } from "../models/workout-day.model.js";
import { NotFoundError } from "../errors/not-found-error.js";

interface InputDto {
  userId: string;
  workoutPlanId: string;
}

interface OutputDto {
  id: string;
  name: string;
  workoutDays: Array<{
    id: string;
    weekDay: WeekDay;
    name: string;
    isRest: boolean;
    coverImageUrl?: string | null;
    estimatedDurationInSeconds: number;
    exercisesCount: number;
  }>;
}

export class GetWorkoutPlan {
  constructor(private workoutPlanRepository: IWorkoutPlanRepository) {}
  async execute(dto: InputDto): Promise<OutputDto> {
    const workoutPlan = await this.workoutPlanRepository.findWorkoutPlanById(
      dto.workoutPlanId,
    );
    if (!workoutPlan || workoutPlan.userId !== dto.userId) {
      throw new NotFoundError("Workout plan not found");
    }
    return {
      id: workoutPlan.id,
      name: workoutPlan.name,
      workoutDays: workoutPlan.workoutDays.map((day) => ({
        id: day.id,
        weekDay: day.weekDay,
        name: day.name,
        isRest: day.isRest,
        coverImageUrl: day.coverImageUrl ?? undefined,
        estimatedDurationInSeconds: day.estimatedDurationInSeconds,
        exercisesCount: day.exercises.length,
      })),
    };
  }
}
