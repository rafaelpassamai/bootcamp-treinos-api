"use server";

import {
  completeUserGoal,
  updateGoalProgress,
} from "@/app/_lib/api/fetch-generated";

export async function completeUserGoalAction(goalId: string) {
  return completeUserGoal(goalId);
}

export async function updateGoalProgressAction(
  goalId: string,
  currentValue: string,
) {
  return updateGoalProgress(goalId, { currentValue });
}
