import React from 'react';
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
}

interface LinhaDiario {
  data: Date;
  execucoes: Execucao[];
  treino?: {
    execucoes: Execucao[];
  };
}

interface ProgressChartProps {
  linhasDiario: LinhaDiario[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ linhasDiario }) => {
  // Processar dados para o gráfico
  const processData = () => {
    const labels: string[] = [];
    const realData: number[] = [];
    const plannedData: number[] = [];

    // Ordenar por data (mais antigo para mais recente)
    const sortedDiario = [...linhasDiario].sort((a, b) => 
      new Date(a.data).getTime() - new Date(b.data).getTime()
    );

    sortedDiario.forEach((linha) => {
      // Formatar data para label
      const date = new Date(linha.data);
      const dateLabel = `${date.getDate()}/${date.getMonth() + 1}`;
      labels.push(dateLabel);

      // Calcular valor total para execuções reais
      const realTotal = linha.execucoes.reduce((sum, exec) => {
        const reps = exec.reps || 0;
        const sets = exec.sets || 0;
        const carga = exec.carga ? Number(exec.carga) : 0;
        return sum + (reps * sets * carga);
      }, 0);
      realData.push(realTotal);

      // Calcular valor total para execuções planejadas (se existir treino)
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
        label: 'Execuções Reais (rep × set × carga)',
        data: realData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Execuções Planejadas (rep × set × carga)',
        data: plannedData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Progresso de Treino - Real vs Planejado',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw.toLocaleString()} kg`;
          }
        }
      }
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
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow">
      <Line options={options} data={data} />
    </div>
  );
};

export default ProgressChart;