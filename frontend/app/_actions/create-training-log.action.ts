"use server";

import { createTrainingLog } from "@/app/_lib/api/fetch-generated";

export async function createTrainingLogAction(data: {
  name?: string;
  description?: string;
}) {
  return createTrainingLog(data);
}
