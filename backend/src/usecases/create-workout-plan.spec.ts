// src/usecases/create-workout-plan.spec.ts
import { describe, it, expect, beforeEach } from "vitest";
import { CreateWorkoutPlan } from "./create-workout-plan.js";
import { InMemoryWorkoutPlanRepository } from "../repositories/in-memory/in-memory-workout-plan-repository.js";

describe("CreateWorkoutPlan", () => {
  let repository: InMemoryWorkoutPlanRepository;
  let sut: CreateWorkoutPlan;

  beforeEach(() => {
    repository = new InMemoryWorkoutPlanRepository();
    sut = new CreateWorkoutPlan(repository);
  });

  it("should create a workout plan", async () => {
    const result = await sut.execute({
      userId: "user-1",
      name: "My Plan",
      workoutDays: [],
    });

    expect(result.id).toBeDefined();
    expect(result.name).toBe("My Plan");
    expect(result.isActive).toBe(true);
    expect(repository.items).toHaveLength(1);
  });

  it("should deactivate the previous active plan when creating a new one", async () => {
    await sut.execute({
      userId: "user-1",
      name: "Plan 1",
      workoutDays: [],
    });

    await sut.execute({
      userId: "user-1",
      name: "Plan 2",
      workoutDays: [],
    });

    expect(repository.items).toHaveLength(2);
    expect(repository.items[0].isActive).toBe(false);
    expect(repository.items[1].isActive).toBe(true);
  });

  it("should not deactivate plans from other users", async () => {
    await sut.execute({
      userId: "user-1",
      name: "Plan user 1",
      workoutDays: [],
    });

    await sut.execute({
      userId: "user-2",
      name: "Plan user 2",
      workoutDays: [],
    });

    expect(repository.items[0].isActive).toBe(true);
    expect(repository.items[1].isActive).toBe(true);
  });
});
