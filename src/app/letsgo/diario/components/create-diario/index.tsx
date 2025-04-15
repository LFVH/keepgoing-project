"use client"
import FormDiario from "../form";

export default function AdicionarLinhaDiario ({ onSuccess }: { onSuccess?: () => void }) {
  return <FormDiario onSuccess={onSuccess}/>;
}