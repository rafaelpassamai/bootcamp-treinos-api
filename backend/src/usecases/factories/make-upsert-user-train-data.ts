import { UpsertUserTrainData } from "../upsert-user-train-data.js";
import { PrismaUserRepository } from "../../repositories/prisma/prisma-user-repository.js";

export function makeUpsertUserTrainData() {
  const userRepository = new PrismaUserRepository();
  return new UpsertUserTrainData(userRepository);
}
