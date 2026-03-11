import { CreateTrainingLog } from "../create-training-log.js";
import { PrismaTrainingLogRepository } from "../../repositories/prisma/prisma-training-log-repository.js";

export function makeCreateTrainingLog() {
  const repository = new PrismaTrainingLogRepository();
  return new CreateTrainingLog(repository);
}
