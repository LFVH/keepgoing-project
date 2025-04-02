"use client"
import FormPessoa from "../form";

export default function AtualizarTreino({ onSuccess }: { onSuccess?: () => void }) {
  return <FormPessoa onSuccess={onSuccess}/>;
}