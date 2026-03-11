import { IWorkoutSessionRepository } from "../repositories/interfaces/workout-session-repository-interface.js";
import { IWorkoutPlanRepository } from "../repositories/interfaces/workout-plan-repository-interface.js";
import { NotFoundError } from "../errors/not-found-error.js";

interface InputDto {
  userId: string;
  workoutPlanId: string;
  workoutDayId: string;
  sessionId: string;
  completedAt: string | null | undefined;
}

interface OutputDto {
  id: string;
  startedAt: string;
  completedAt: string | null | undefined;
}

export class UpdateWorkoutSession {
  constructor(
    private readonly workoutSessionRepository: IWorkoutSessionRepository,
    private readonly workoutPlanRepository: IWorkoutPlanRepository,
  ) {}

  async execute(dto: InputDto): Promise<OutputDto> {
    const workoutPlan = await this.workoutPlanRepository.findWorkoutPlanById(
      dto.workoutPlanId,
    );

    if (!workoutPlan || workoutPlan.userId !== dto.userId) {
      throw new NotFoundError("Workout plan not found");
    }

    const workoutDay = workoutPlan.workoutDays.find(
      (day) => day.id === dto.workoutDayId,
    );

    if (!workoutDay) {
      throw new NotFoundError("Workout day not found");
    }

    const workoutSession =
      await this.workoutSessionRepository.findWorkoutSessionByWorkoutDayId(
        dto.workoutDayId,
      );

    if (!workoutSession) {
      throw new NotFoundError("Workout session not found");
    }

    workoutSession.finish();

    await this.workoutSessionRepository.save(workoutSession);

    return {
      id: workoutSession.id,
      startedAt: workoutSession.startedAt.toISOString(),
      completedAt: workoutSession.completedAt?.toISOString(),
    };
  }
}
