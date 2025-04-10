"use client"
import FormTreino from "../form";

export default function AdicionarTreino ({ onSuccess }: { onSuccess?: () => void }) {
  return <FormTreino onSuccess={onSuccess}/>;
}