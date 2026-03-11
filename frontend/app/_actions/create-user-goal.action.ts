"use server";

import { createUserGoal } from "@/app/_lib/api/fetch-generated";

export async function createUserGoalAction(data: {
  title: string;
  currentValue?: string;
  targetValue?: string;
}) {
  return createUserGoal(data);
}
