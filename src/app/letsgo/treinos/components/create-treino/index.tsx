"use client"
import FormPessoa from "../form";

export default function AdicionarTreino ({ onSuccess }: { onSuccess?: () => void }) {
  return <FormPessoa onSuccess={onSuccess}/>;
}