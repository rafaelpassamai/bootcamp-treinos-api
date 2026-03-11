import { z } from "zod";
import { WorkoutSessionAlreadyFinishError } from "../errors/workout-session-already-finish-error.js";

const workoutSessionPropsSchema = z.object({
  id: z.uuid(),
  workoutDayId: z.uuid(),
  startedAt: z.date(),
  completedAt: z.date().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type WorkoutSessionProps = z.infer<typeof workoutSessionPropsSchema>;
export class WorkoutSession {
  private data: WorkoutSessionProps;

  private constructor(data: WorkoutSessionProps) {
    const parsed = workoutSessionPropsSchema.parse(data);
    this.data = parsed;
  }

  static create(
    data: Omit<WorkoutSessionProps, "id" | "createdAt" | "updatedAt">,
  ): WorkoutSession {
    const now = new Date();
    return new WorkoutSession({
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(data: WorkoutSessionProps): WorkoutSession {
    return new WorkoutSession(data);
  }

  get id() {
    return this.data.id;
  }

  get workoutDayId() {
    return this.data.workoutDayId;
  }

  get startedAt() {
    return this.data.startedAt;
  }

  get completedAt() {
    return this.data.completedAt;
  }

  get createdAt() {
    return this.data.createdAt;
  }

  get updatedAt() {
    return this.data.updatedAt;
  }

  finish(): void {
    if (this.data.completedAt) {
      throw new WorkoutSessionAlreadyFinishError(
        "Workout session is already finished",
      );
    }
    this.data.completedAt = new Date();
    this.data.updatedAt = new Date();
  }
}
