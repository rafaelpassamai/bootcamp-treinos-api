import { GetUserTrainData } from "../get-user-train-data.js";
import { PrismaUserRepository } from "../../repositories/prisma/prisma-user-repository.js";

export function makeGetUserTrainData() {
  const userRepository = new PrismaUserRepository();
  return new GetUserTrainData(userRepository);
}
