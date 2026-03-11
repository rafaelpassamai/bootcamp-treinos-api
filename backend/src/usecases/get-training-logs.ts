import { ITrainingLogRepository } from "../repositories/interfaces/training-log-repository-interface.js";

interface InputDto {
  userId: string;
}

interface OutputDto {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export class GetTrainingLogs {
  constructor(private readonly repository: ITrainingLogRepository) {}

  async execute(dto: InputDto): Promise<OutputDto[]> {
    const logs = await this.repository.findManyByUserId(dto.userId);

    return logs.map((log) => ({
      id: log.id,
      name: log.name,
      description: log.description,
      createdAt: log.createdAt,
    }));
  }
}
