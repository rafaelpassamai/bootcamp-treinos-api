import { AppError } from "./app-error.js";

export class WorkoutSessionAlreadyStartedError extends AppError {
  constructor(
    message = "A session for this workout day has already been started.",
  ) {
    super(message, 409, "WORKOUT_SESSION_ALREADY_STARTED");
    this.name = "WorkoutSessionAlreadyStartedError";
  }
}
