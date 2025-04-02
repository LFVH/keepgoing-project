"use client";
import { useQuery } from "@tanstack/react-query";

const fetchTreinos = async () => {
  const response = await fetch(`/api/treino`);
  const data = await response.json();
  return data.data || [];
};

export default function Page() {
  const { data: treinos, isLoading, isError } = useQuery({
    queryKey: ["getPessoasAtual"],
    queryFn: () => fetchTreinos(),
  });

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro ao carregar dados</p>;

  return (
    <ul>
      {treinos.map((treino: any) => (
        <li key={treino.id}>{treino.nome}</li>
      ))}
    </ul>
  );
}
