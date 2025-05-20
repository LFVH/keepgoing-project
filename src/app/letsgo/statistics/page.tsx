'use client'
import ProgressChart from '@/components/GraficoTop';
import { useQuery } from '@tanstack/react-query';
import { Loader } from 'rsuite';
const fetchDiario = async () => {
    const response = await fetch(`/api/letsgo/grafico`, { method: "GET" });
    const data = await response.json();
    return data.data || [];
  };
// Em seu componente de página:
export default function Page() {
      const { 
    data: linhas,
    isLoading,
    isSuccess,
    refetch,
    isFetching,
    isError, 
    error,
   } = useQuery({
    queryKey: ["getTreinosUsuario"],
    initialData: [],
    queryFn: () => fetchDiario(),
  })

  if (isLoading || isFetching) {
    return <Loader/>;
  }
  
  if (isError) {
    console.error("Erro ao buscar ", error);
    return <p>Erro ao carregar dados</p>;
  }


  return (
    <div>
      <h1>Meu Progresso</h1>
      <ProgressChart linhasDiario={linhas} />
    </div>
  );
};
