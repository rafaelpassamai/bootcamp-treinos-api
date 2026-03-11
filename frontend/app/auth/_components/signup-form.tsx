"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { SignInWithGoogle } from "./sign-in-with-google";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) return;
    if (password.trim().length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      });
      if (result.error) {
        setError(result.error.message || "Erro ao criar conta. Tente novamente.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 font-heading text-sm text-white placeholder:text-white/40 outline-none"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 font-heading text-sm text-white placeholder:text-white/40 outline-none"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 font-heading text-sm text-white placeholder:text-white/40 outline-none"
        />
        {error && <p className="font-heading text-xs text-red-400">{error}</p>}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full rounded-full bg-primary py-3 font-heading text-sm font-semibold text-primary-foreground disabled:opacity-50"
      >
        {isLoading ? "Criando conta..." : "Criar conta"}
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="font-heading text-xs text-white/40">ou</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <SignInWithGoogle />
    </div>
  );
}
