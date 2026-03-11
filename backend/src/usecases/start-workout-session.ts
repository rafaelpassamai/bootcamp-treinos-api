import { WorkoutSession } from "../models/workout-session.js";
import { IWorkoutSessionRepository } from "../repositories/interfaces/workout-session-repository-interface.js";
import { IWorkoutPlanRepository } from "../repositories/interfaces/workout-plan-repository-interface.js";
import { NotFoundError } from "../errors/not-found-error.js";
import { WorkoutSessionAlreadyStartedError } from "../errors/workout-session-already-started-error.js";

interface InputDto {
  userId: string;
  workoutPlanId: string;
  workoutDayId: string;
}

interface OutputDto {
  userWorkoutSessionId: string;
}

export class StartWorkoutSession {
  constructor(
    private readonly workoutSessionRepository: IWorkoutSessionRepository,
    private readonly workoutPlanRepository: IWorkoutPlanRepository,
  ) {}

  async execute(dto: InputDto): Promise<OutputDto> {
    const workoutPlan = await this.workoutPlanRepository.findWorkoutPlanById(
      dto.workoutPlanId,
    );

    if (!workoutPlan) {
      throw new NotFoundError("Workout plan not found");
    }

    if (workoutPlan.userId !== dto.userId) {
      throw new NotFoundError("Workout plan not found");
    }

    const workoutDay = workoutPlan.workoutDays.find(
      (day) => day.id === dto.workoutDayId,
    );

    if (!workoutDay) {
      throw new NotFoundError("Workout day not found");
    }

    const existingSession =
      await this.workoutSessionRepository.findWorkoutSessionByWorkoutDayId(
        dto.workoutDayId,
      );

    if (existingSession) {
      throw new WorkoutSessionAlreadyStartedError(
        "Workout session already exists for this workout day",
      );
    }

    const workoutSession = WorkoutSession.create({
      workoutDayId: dto.workoutDayId,
      startedAt: new Date(),
    });

    await this.workoutSessionRepository.create(workoutSession);

    return {
      userWorkoutSessionId: workoutSession.id,
    };
  }
}
