import { IWorkoutPlanRepository } from "../repositories/interfaces/workout-plan-repository-interface.js";
import { WorkoutPlan } from "../models/workout-plan.model.js";
import { WorkoutDay } from "../models/workout-day.model.js";
import { WorkoutExercise } from "../models/workout-exercise.model.js";
import { WeekDay } from "../models/workout-day.model.js";

interface InputDto {
  userId: string;
  name: string;
  workoutDays: Array<{
    name: string;
    weekDay: WeekDay;
    isRest: boolean;
    estimatedDurationInSeconds: number;
    coverImageUrl?: string | null | undefined;
    exercises: Array<{
      order: number;
      name: string;
      sets: number;
      reps: number;
      restTimeInSeconds: number;
    }>;
  }>;
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
    coverImageUrl?: string | null | undefined;
    exercises: Array<{
      id: string;
      order?: number;
      name: string;
      sets?: number;
      reps?: number;
      restTimeInSeconds?: number;
    }>;
  }>;
}

export class CreateWorkoutPlan {
  constructor(private readonly repository: IWorkoutPlanRepository) {}

  async execute(dto: InputDto): Promise<OutputDto> {
    const existingWorkoutPlan = await this.repository.findWorkoutPlanByUserId(
      dto.userId,
    );

    if (existingWorkoutPlan) {
      existingWorkoutPlan.deactivate();
      await this.repository.save(existingWorkoutPlan);
    }

    const workoutPlan = WorkoutPlan.create({
      name: dto.name,
      userId: dto.userId,
      workoutDays: dto.workoutDays.map((day) =>
        WorkoutDay.create({
          ...day,
          exercises: day.exercises.map((exercise, index) =>
            WorkoutExercise.create({
              ...exercise,
              order: exercise.order ?? index,
            }),
          ),
        }),
      ),
    });

    await this.repository.create(workoutPlan);

    return {
      id: workoutPlan.id,
      name: workoutPlan.name,
      isActive: workoutPlan.isActive,
      workoutDays: workoutPlan.workoutDays.map((day) => ({
        id: day.id,
        name: day.name,
        weekDay: day.weekDay,
        isRest: day.isRest,
        estimatedDurationInSeconds: day.estimatedDurationInSeconds,
        coverImageUrl: day.coverImageUrl,
        exercises: day.exercises.map((exercise) => ({
          id: exercise.id,
          order: exercise.order,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          restTimeInSeconds: exercise.restTimeInSeconds,
        })),
      })),
    };
  }
}
