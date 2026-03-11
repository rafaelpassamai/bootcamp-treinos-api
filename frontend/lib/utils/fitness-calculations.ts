export function calculateBMI(weightInKg: number, heightInCm: number): number {
  const heightInM = heightInCm / 100;
  return Math.round((weightInKg / (heightInM * heightInM)) * 10) / 10;
}

export function calculateBMR(
  weightInKg: number,
  heightInCm: number,
  age: number,
  gender: string,
): number {
  const base = 10 * weightInKg + 6.25 * heightInCm - 5 * age;
  return Math.round(gender === "male" ? base + 5 : base - 161);
}
