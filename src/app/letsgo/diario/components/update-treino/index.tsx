"use client"
import FormTreino from "../form";

export default function AtualizarTreino({ onSuccess }: { onSuccess?: () => void }) {
  return <FormTreino onSuccess={onSuccess}/>;
}