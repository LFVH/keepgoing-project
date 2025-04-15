"use client"
import FormDiario from "../form";

export default function AtualizarLinhaDiario({ onSuccess }: { onSuccess?: () => void }) {
  return <FormDiario onSuccess={onSuccess}/>;
}