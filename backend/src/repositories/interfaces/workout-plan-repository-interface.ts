import { WorkoutPlan } from "../../models/workout-plan.model.js";

export interface IWorkoutPlanRepository {
  findManyByUserId(userId: string, active?: boolean): Promise<WorkoutPlan[]>;
  findWorkoutPlanById(id: string): Promise<WorkoutPlan | null>;
  findWorkoutPlanByUserId(userId: string): Promise<WorkoutPlan | null>;
  findActiveWorkoutPlanWithDaysAndSessionsByUserId(userId: string): Promise<WorkoutPlan | null>;
  create(workoutPlan: WorkoutPlan): Promise<void>;
  save(workoutPlan: WorkoutPlan): Promise<void>;
}
