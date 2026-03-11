import { IUserRepository } from "../repositories/interfaces/user-repository-interface.js";

interface InputDto {
  userId: string;
}

interface OutputDto {
  userId: string;
  userName: string;
  weightInGrams: number;
  heightInCentimeters: number;
  age: number;
  bodyFatPercentage: number;
  gender: string;
}

export class GetUserTrainData {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: InputDto): Promise<OutputDto | null> {
    const user = await this.userRepository.findById(dto.userId);

    if (!user || !user.hasTrainData()) {
      return null;
    }

    return {
      userId: user.id,
      userName: user.name,
      weightInGrams: user.weightInGrams!,
      heightInCentimeters: user.heightInCentimeters!,
      age: user.age!,
      bodyFatPercentage: user.bodyFatPercentage!,
      gender: user.gender!,
    };
  }
}
