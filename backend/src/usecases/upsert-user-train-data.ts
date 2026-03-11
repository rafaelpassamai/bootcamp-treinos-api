import { IUserRepository } from "../repositories/interfaces/user-repository-interface.js";
import { NotFoundError } from "../errors/not-found-error.js";

interface InputDto {
  userId: string;
  weightInGrams: number;
  heightInCentimeters: number;
  age: number;
  bodyFatPercentage: number;
  gender: string;
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

export class UpsertUserTrainData {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: InputDto): Promise<OutputDto> {
    const user = await this.userRepository.findById(dto.userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    user.updateTrainData({
      weightInGrams: dto.weightInGrams,
      heightInCentimeters: dto.heightInCentimeters,
      age: dto.age,
      bodyFatPercentage: dto.bodyFatPercentage,
      gender: dto.gender,
    });

    await this.userRepository.save(user);

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
