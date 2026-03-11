import { z } from "zod";
import { WorkoutDay } from "./workout-day.model.js";

const workoutPlanPropsSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1),
  userId: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type WorkoutPlanProps = z.infer<typeof workoutPlanPropsSchema> & {
  workoutDays: WorkoutDay[];
};

export class WorkoutPlan {
  private data: WorkoutPlanProps;

  private constructor(data: WorkoutPlanProps) {
    const parsed = workoutPlanPropsSchema.parse(data);
    this.data = {
      ...parsed,
      workoutDays: data.workoutDays,
    };
  }

  static create(
    data: Omit<WorkoutPlanProps, "id" | "isActive" | "createdAt" | "updatedAt">,
  ): WorkoutPlan {
    const now = new Date();
    return new WorkoutPlan({
      ...data,
      id: crypto.randomUUID(),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(data: WorkoutPlanProps): WorkoutPlan {
    return new WorkoutPlan(data);
  }

  get id() {
    return this.data.id;
  }
  get name() {
    return this.data.name;
  }
  get userId() {
    return this.data.userId;
  }
  get isActive() {
    return this.data.isActive;
  }
  get createdAt() {
    return this.data.createdAt;
  }
  get updatedAt() {
    return this.data.updatedAt;
  }
  get workoutDays() {
    return this.data.workoutDays;
  }

  deactivate(): void {
    this.data.isActive = false;
    this.data.updatedAt = new Date();
  }
}
