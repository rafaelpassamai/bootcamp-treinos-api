import { AppError } from "./app-error.js";

export class UnauthorizedError extends AppError {
  constructor() {
    super("Unauthorized", 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}
