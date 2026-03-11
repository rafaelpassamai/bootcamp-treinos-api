import { z } from "zod";

const trainingLogPropsSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  name: z.string().trim().min(1),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type TrainingLogProps = z.infer<typeof trainingLogPropsSchema>;

export class TrainingLog {
  private data: TrainingLogProps;

  private constructor(data: TrainingLogProps) {
    this.data = trainingLogPropsSchema.parse(data);
  }

  static create(
    data: Omit<TrainingLogProps, "id" | "createdAt" | "updatedAt">,
  ): TrainingLog {
    const now = new Date();
    return new TrainingLog({
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(data: TrainingLogProps): TrainingLog {
    return new TrainingLog(data);
  }

  get id() {
    return this.data.id;
  }
  get userId() {
    return this.data.userId;
  }
  get name() {
    return this.data.name;
  }
  get description() {
    return this.data.description;
  }
  get createdAt() {
    return this.data.createdAt;
  }
  get updatedAt() {
    return this.data.updatedAt;
  }
}
