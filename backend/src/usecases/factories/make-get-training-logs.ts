import { GetTrainingLogs } from "../get-training-logs.js";
import { PrismaTrainingLogRepository } from "../../repositories/prisma/prisma-training-log-repository.js";

export function makeGetTrainingLogs() {
  const repository = new PrismaTrainingLogRepository();
  return new GetTrainingLogs(repository);
}
