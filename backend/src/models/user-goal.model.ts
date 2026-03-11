import { z } from "zod";

const userGoalPropsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().trim().min(1),
  currentValue: z.string().optional(),
  targetValue: z.string().optional(),
  completedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type UserGoalProps = z.infer<typeof userGoalPropsSchema>;

export class UserGoal {
  private data: UserGoalProps;

  private constructor(data: UserGoalProps) {
    this.data = userGoalPropsSchema.parse(data);
  }

  static create(
    data: Omit<UserGoalProps, "id" | "createdAt" | "updatedAt">,
  ): UserGoal {
    const now = new Date();
    return new UserGoal({
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(data: UserGoalProps): UserGoal {
    return new UserGoal(data);
  }

  complete(): void {
    this.data.completedAt = new Date();
    this.data.updatedAt = new Date();
  }

  updateProgress(currentValue: string): void {
    this.data.currentValue = currentValue;
    this.data.updatedAt = new Date();
  }

  get id() {
    return this.data.id;
  }
  get userId() {
    return this.data.userId;
  }
  get title() {
    return this.data.title;
  }
  get currentValue() {
    return this.data.currentValue;
  }
  get targetValue() {
    return this.data.targetValue;
  }
  get completedAt() {
    return this.data.completedAt;
  }
  get isCompleted() {
    return !!this.data.completedAt;
  }
  get createdAt() {
    return this.data.createdAt;
  }
  get updatedAt() {
    return this.data.updatedAt;
  }
}
