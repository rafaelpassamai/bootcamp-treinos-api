import { prisma } from "../../lib/db.js";
import { IUserRepository } from "../interfaces/user-repository-interface.js";
import { User } from "../../models/user.model.js";

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return User.restore({
      id: user.id,
      name: user.name,
      weightInGrams: user.weightInGrams,
      heightInCentimeters: user.heightInCentimeters,
      age: user.age,
      bodyFatPercentage: user.bodyFatPercentage,
      gender: user.gender,
    });
  }

  async save(user: User): Promise<void> {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        weightInGrams: user.weightInGrams,
        heightInCentimeters: user.heightInCentimeters,
        age: user.age,
        bodyFatPercentage: user.bodyFatPercentage,
        gender: user.gender,
      },
    });
  }
}
