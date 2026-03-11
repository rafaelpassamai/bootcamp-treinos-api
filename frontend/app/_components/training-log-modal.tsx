"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTrainingLogAction } from "@/app/_actions/create-training-log.action";

interface TrainingLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrainingLogModal({ isOpen, onClose }: TrainingLogModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await createTrainingLogAction({
        name: name.trim() || undefined,
        description: description.trim() || undefined,
      });
      router.refresh();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-foreground/30" onClick={onClose} />
      <div className="relative z-10 w-full rounded-[20px] bg-background p-5 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Registrar Treino
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nome do treino (opcional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-border bg-background px-4 py-3 font-heading text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <textarea
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="rounded-xl border border-border bg-background px-4 py-3 font-heading text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full rounded-full"
        >
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
