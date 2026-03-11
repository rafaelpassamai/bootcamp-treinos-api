import { TrainingLog } from "../../models/training-log.model.js";

export interface ITrainingLogRepository {
  create(trainingLog: TrainingLog): Promise<void>;
  findManyByUserId(userId: string): Promise<TrainingLog[]>;
  findById(id: string): Promise<TrainingLog | null>;
  findManyByUserIdAndDateRange(
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<TrainingLog[]>;
}
