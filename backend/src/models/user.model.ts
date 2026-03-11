import { z } from "zod";

const userPropsSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1),
  weightInGrams: z.number().int().positive().nullable(),
  heightInCentimeters: z.number().int().positive().nullable(),
  age: z.number().int().positive().nullable(),
  bodyFatPercentage: z.number().int().min(0).max(100).nullable(),
  gender: z.string().nullable(),
});

type UserProps = z.infer<typeof userPropsSchema>;

export class User {
  private data: UserProps;

  private constructor(data: UserProps) {
    this.data = userPropsSchema.parse(data);
  }

  static restore(data: UserProps): User {
    return new User(data);
  }

  get id() {
    return this.data.id;
  }
  get name() {
    return this.data.name;
  }
  get weightInGrams() {
    return this.data.weightInGrams;
  }
  get heightInCentimeters() {
    return this.data.heightInCentimeters;
  }
  get age() {
    return this.data.age;
  }
  get bodyFatPercentage() {
    return this.data.bodyFatPercentage;
  }

  get gender() {
    return this.data.gender;
  }

  hasTrainData(): boolean {
    return (
      this.data.weightInGrams !== null &&
      this.data.heightInCentimeters !== null &&
      this.data.age !== null &&
      this.data.bodyFatPercentage !== null &&
      this.data.gender !== null
    );
  }

  updateTrainData(data: {
    weightInGrams: number;
    heightInCentimeters: number;
    age: number;
    bodyFatPercentage: number;
    gender: string;
  }): void {
    this.data.weightInGrams = data.weightInGrams;
    this.data.heightInCentimeters = data.heightInCentimeters;
    this.data.age = data.age;
    this.data.bodyFatPercentage = data.bodyFatPercentage;
    this.data.gender = data.gender;
  }
}
