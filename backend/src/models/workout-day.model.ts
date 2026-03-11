import { z } from "zod";
import { WorkoutExercise } from "./workout-exercise.model.js";
import { BadRequestError } from "../errors/bad-request-error.js";

export const WeekDaySchema = z.enum([
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
]);

export type WeekDay = z.infer<typeof WeekDaySchema>;

const workoutDayPropsSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1),
  weekDay: z.enum(WeekDaySchema.options),
  isRest: z.boolean().default(false),
  estimatedDurationInSeconds: z.number().int().min(1),
  coverImageUrl: z.string().nullable().optional(),
});

type WorkoutDayProps = z.infer<typeof workoutDayPropsSchema> & {
  exercises: WorkoutExercise[];
};

export class WorkoutDay {
  private data: WorkoutDayProps;

  private constructor(data: WorkoutDayProps) {
    const parsed = workoutDayPropsSchema.parse(data);
    this.data = {
      ...parsed,
      exercises: data.exercises,
    };
  }

  static create(data: Omit<WorkoutDayProps, "id">): WorkoutDay {
    if (data.isRest && data.exercises.length > 0) {
      throw new BadRequestError("A rest day cannot have exercises");
    }

    return new WorkoutDay({
      ...data,
      id: crypto.randomUUID(),
    });
  }

  static restore(data: WorkoutDayProps): WorkoutDay {
    return new WorkoutDay(data);
  }

  get id() {
    return this.data.id;
  }
  get name() {
    return this.data.name;
  }
  get weekDay() {
    return this.data.weekDay;
  }
  get isRest() {
    return this.data.isRest;
  }
  get estimatedDurationInSeconds() {
    return this.data.estimatedDurationInSeconds;
  }
  get coverImageUrl() {
    return this.data.coverImageUrl;
  }
  get exercises() {
    return this.data.exercises;
  }
}
