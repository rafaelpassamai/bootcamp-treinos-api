import { AppError } from "./app-error.js";

export class WorkoutSessionAlreadyFinishError extends AppError {
  constructor(
    message = "A session for this workout day has already been finished.",
  ) {
    super(message, 409, "WORKOUT_SESSION_ALREADY_FINISHED");
    this.name = "WorkoutSessionAlreadyFinishError";
  }
}
