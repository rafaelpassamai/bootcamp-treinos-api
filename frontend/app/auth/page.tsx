import Image from "next/image";
import { redirect } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { AuthTabs } from "./_components/auth-tabs";

export default async function AuthPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (session.data?.user) redirect("/");

  return (
    <div className="relative flex min-h-svh flex-col bg-black">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <Image
          src="/login-bg.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 75%, #000 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex justify-center pt-12">
        <Image src="/fit-ai-logo.svg" alt="FIT.AI" width={85} height={38} />
      </div>

      <div className="flex-1" />

      <div className="relative z-10 flex flex-col gap-6 rounded-t-[20px] bg-black/80 px-5 pb-10 pt-8 backdrop-blur-sm">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-heading text-[28px] font-semibold leading-[1.05] text-white">
            Transforme seus treinos com IA.
          </h1>
          <p className="font-heading text-sm text-white/50">
            Entre ou crie sua conta para começar.
          </p>
        </div>

        <AuthTabs />
      </div>
    </div>
  );
}
