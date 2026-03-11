import { z } from "zod";

const workoutExercisePropsSchema = z.object({
  id: z.uuid(),
  order: z.number().int().min(0).optional(),
  name: z.string().trim().min(1),
  sets: z.number().int().min(1).optional(),
  reps: z.number().int().min(1).optional(),
  restTimeInSeconds: z.number().int().min(1).optional(),
});

type WorkoutExerciseProps = z.infer<typeof workoutExercisePropsSchema>;

export class WorkoutExercise {
  private data: WorkoutExerciseProps;

  private constructor(data: WorkoutExerciseProps) {
    this.data = workoutExercisePropsSchema.parse(data);
  }

  static create(data: Omit<WorkoutExerciseProps, "id">): WorkoutExercise {
    return new WorkoutExercise({
      ...data,
      id: crypto.randomUUID(),
    });
  }

  static restore(data: WorkoutExerciseProps): WorkoutExercise {
    return new WorkoutExercise(data);
  }

  get id() {
    return this.data.id;
  }
  get order() {
    return this.data.order;
  }
  get name() {
    return this.data.name;
  }
  get sets() {
    return this.data.sets;
  }
  get reps() {
    return this.data.reps;
  }
  get restTimeInSeconds() {
    return this.data.restTimeInSeconds;
  }
}
