import { redirect } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { getUserGoals } from "@/app/_lib/api/fetch-generated";
import { BottomNav } from "@/app/_components/bottom-nav";
import { BackButton } from "@/app/workout-plans/[id]/days/[dayId]/_components/back-button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import dayjs from "dayjs";

export default async function CompletedGoalsPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const goalsData = await getUserGoals();

  if (goalsData.status !== 200) {
    throw new Error("Failed to fetch goals");
  }

  const completedGoals = goalsData.data.filter((g) => g.completedAt);

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="relative flex h-[296px] shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-[20px] px-5 pb-10 pt-5">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/workout-plan-banner.png"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(238deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
            }}
          />
        </div>

        <div className="relative flex w-full items-center justify-between">
          <p
            className="text-[22px] uppercase leading-[1.15] text-background"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            Fit.ai
          </p>
          <BackButton />
        </div>

        <div className="relative flex w-full items-end justify-between">
          <div className="flex flex-col gap-3">
            <Badge className="gap-1 rounded-full px-2.5 py-1.5 font-heading text-xs font-semibold uppercase">
              <Trophy className="size-4" />
              Histórico
            </Badge>
            <h1 className="font-heading text-2xl font-semibold leading-[1.05] text-background">
              Metas Concluídas
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-5 pt-5">
        {completedGoals.length === 0 ? (
          <p className="font-heading text-sm text-muted-foreground text-center py-10">
            Nenhuma meta concluída ainda.
          </p>
        ) : (
          completedGoals.map((goal) => (
            <div
              key={goal.id}
              className="flex flex-col gap-2 rounded-xl border border-border p-5"
            >
              <div className="flex items-center justify-between">
                <p className="font-heading text-base font-semibold text-foreground">
                  {goal.title}
                </p>
                <span className="font-heading text-xs text-muted-foreground">
                  {dayjs(goal.completedAt).format("DD/MM/YYYY")}
                </span>
              </div>
              {(goal.currentValue || goal.targetValue) && (
                <div className="flex items-center gap-2">
                  <span className="font-heading text-sm text-muted-foreground">
                    {goal.currentValue ?? "-"}
                  </span>
                  <span className="font-heading text-xs text-muted-foreground">
                    →
                  </span>
                  <span className="font-heading text-sm text-primary">
                    {goal.targetValue ?? "-"}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <BottomNav activePage="profile" />
    </div>
  );
}
