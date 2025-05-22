import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useQuery } from '@tanstack/react-query';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Execucao {
  reps?: number;
  sets?: number;
  carga?: number;
  exercicioId: number;
}

interface LinhaDiario {
  data: Date;
  execucoes: Execucao[];
  treino?: {
    execucoes: Execucao[];
  };
}

interface ExercicioOption {
  id: number;
  nome: string;
}

const fetchProgressData = async (exercicioId?: number) => {
  const res = await fetch(`/api/letsgo/grafico?${exercicioId ? `&exercicioId=${exercicioId}` : ''}`);
  return res.json();
};

const fetchExerciciosRealizados = async () => {
  const res = await fetch(`/api/letsgo/grafico/exerciciosRealizados`);
  return res.json();
};

const ProgressChart = () => {
  const [selectedExercicio, setSelectedExercicio] = useState<number | undefined>();
  
  // Buscar opções de exercícios
  const { data: exerciciosOptions } = useQuery<ExercicioOption[]>({
    queryKey: ['exerciciosRealizados'],
    queryFn: fetchExerciciosRealizados,
  });
  
  // Buscar dados do gráfico
  const { data: linhasDiario } = useQuery<LinhaDiario[]>({
    queryKey: ['progressData', selectedExercicio],
    queryFn: () => fetchProgressData(selectedExercicio),
  });

  const processData = () => {
    if (!linhasDiario) return { labels: [], realData: [], plannedData: [] };

    const labels: string[] = [];
    const realData: number[] = [];
    const plannedData: number[] = [];

    linhasDiario.forEach((linha) => {
      const date = new Date(linha.data);
      labels.push(`${date.getDate()}/${date.getMonth() + 1}`);

      // Calcular total real
      const realTotal = linha.execucoes.reduce((sum, exec) => {
        const reps = exec.reps || 0;
        const sets = exec.sets || 0;
        const carga = exec.carga ? Number(exec.carga) : 0;
        return sum + (reps * sets * carga);
      }, 0);
      realData.push(realTotal);

      // Calcular total planejado
      const plannedTotal = linha.treino?.execucoes.reduce((sum, exec) => {
        const reps = exec.reps || 0;
        const sets = exec.sets || 0;
        const carga = exec.carga ? Number(exec.carga) : 0;
        return sum + (reps * sets * carga);
      }, 0) || 0;
      plannedData.push(plannedTotal);
    });

    return { labels, realData, plannedData };
  };

  const { labels, realData, plannedData } = processData(); 
  const data = {
    labels,
    datasets: [
      {
        label: selectedExercicio 
          ? `Execuções Reais - ${exerciciosOptions?.find(e => e.id === selectedExercicio)?.nome || 'Exercício'}`
          : 'Execuções Reais (Todos exercícios)',
        data: realData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: selectedExercicio 
          ? `Execuções Planejadas - ${exerciciosOptions?.find(e => e.id === selectedExercicio)?.nome || 'Exercício'}`
          : 'Execuções Planejadas (Todos exercícios)',
        data: plannedData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <label htmlFor="exercicio" className="block text-sm font-medium text-gray-700">
          Filtrar por exercício:
        </label>
        <select
          id="exercicio"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedExercicio || ''}
          onChange={(e) => setSelectedExercicio(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Todos os exercícios</option>
          {exerciciosOptions?.map((exercicio) => (
            <option key={exercicio.id} value={exercicio.id}>
              {exercicio.nome}
            </option>
          ))}
        </select>
      </div>
      
      <Line 
        data={data} 
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: selectedExercicio
                ? `Progresso - ${exerciciosOptions?.find(e => e.id === selectedExercicio)?.nome || 'Exercício'}`
                : 'Progresso Geral',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Volume (rep × set × carga)'
              }
            }
          }
        }} 
      />
    </div>
  );
};

export default ProgressChart;