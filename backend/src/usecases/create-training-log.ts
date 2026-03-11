import dayjs from "dayjs";
import { ITrainingLogRepository } from "../repositories/interfaces/training-log-repository-interface.js";
import { TrainingLog } from "../models/training-log.model.js";

interface InputDto {
  userId: string;
  name?: string;
  description?: string;
}

interface OutputDto {
  id: string;
  userId: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export class CreateTrainingLog {
  constructor(private readonly repository: ITrainingLogRepository) {}

  async execute(dto: InputDto): Promise<OutputDto> {
    const name: string =
      (dto.name?.trim() || undefined) ??
      `Treino do dia ${dayjs().format("DD/MM/YYYY")}`;

    const trainingLog = TrainingLog.create({
      userId: dto.userId,
      name,
      description: dto.description,
    });

    await this.repository.create(trainingLog);

    return {
      id: trainingLog.id,
      userId: trainingLog.userId,
      name: name,
      description: trainingLog.description,
      createdAt: trainingLog.createdAt,
    };
  }
}
