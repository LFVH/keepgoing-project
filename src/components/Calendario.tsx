import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LinhasDiario {
  id: number;
  data: string;
  treino?: {
    corCalendario?: string;
    id?: number;
  };
}

interface CalendarioTreinosProps {
  linhasDiario: LinhasDiario[];
}

const CalendarioTreinos: React.FC<CalendarioTreinosProps> = ({ linhasDiario }) => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);
  
  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

  useEffect(() => {
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    setDaysInMonth(days);
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    if (!isSameMonth(currentDate, new Date())) {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const handleDayClick = (day: Date) => {
    const dayStr = formatDate(day);
    const diario = linhasDiario.find(d => formatDate(parseISO(d.data)) === dayStr);
    
    if (diario) {
      router.push(`/letsgo/diario?editar-diario=open&registro=${diario.id}`);
    } else {
      const dateParam = format(day, 'yyyy-MM-dd');
      if (isSameDay(day, new Date())) {
        router.push(`/letsgo/diario?boa-segue-firme=open`);
    } else {
        router.push(`/letsgo/diario?boa-segue-firme=open&registrarDia=${dateParam}`);
      }
    }
  };

  const getDayColor = (day: Date) => {
    const dayStr = formatDate(day);
    const diario = linhasDiario.find(d => formatDate(parseISO(d.data)) === dayStr);
    return diario?.treino?.corCalendario || 'bg-white';
  };

  const getDayColors = (day: Date): string[] => {
  const dayStr = formatDate(day);
  const diarios = linhasDiario.filter(d => formatDate(parseISO(d.data)) === dayStr);
  
  return diarios.map(d => d.treino?.corCalendario || '#cccccc');
};

  const weekDays = [
    { short: 'D', full: 'Domingo', key: 'weekday-0' },
    { short: 'S', full: 'Segunda', key: 'weekday-1' },
    { short: 'T', full: 'Terça', key: 'weekday-2' },
    { short: 'Q', full: 'Quarta', key: 'weekday-3' },
    { short: 'Q', full: 'Quinta', key: 'weekday-4' },
    { short: 'S', full: 'Sexta', key: 'weekday-5' },
    { short: 'S', full: 'Sábado', key: 'weekday-6' },
  ];

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 bg-gray-800 text-white">
        <button 
          onClick={handlePrevMonth}
          className="p-1 rounded-full hover:bg-gray-700"
        >
          &lt;
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <button 
          onClick={handleNextMonth}
          disabled={isSameMonth(currentDate, new Date())}
          className={`p-1 rounded-full ${isSameMonth(currentDate, new Date()) ? 'opacity-50' : 'hover:bg-gray-700'}`}
        >
          &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 p-4">
        {weekDays.map((day) => (
          <div key={day.key} className="text-center font-medium text-gray-500 py-2">
            {day.short}
          </div>
        ))}
        
        {daysInMonth.map((day) => {
  const isToday = isSameDay(day, new Date());
  const dayNumber = format(day, 'd');
  const dayColors = getDayColors(day); // Agora retorna um array de cores
  
  // Verifica se há treinos no dia
  const hasTraining = dayColors.length > 0;
  
  return (
    <div
      key={day.toString()}
      onClick={() => handleDayClick(day)}
      className={`h-10 flex items-center justify-center rounded-full cursor-pointer
        ${!hasTraining ? 'border border-gray-300 hover:border-blue-500' : ''}
        ${isToday ? 'ring-2 ring-blue-500' : ''}
        relative group`}
    >
      {/* Número do dia */}
      <span className={`${isToday ? 'font-bold' : ''} z-10`}>
        {dayNumber}
      </span>
      
      {/* Emoji de fogo para dias com treino */}
      {hasTraining && (
        <span 
          className="absolute text-xs opacity-70 group-hover:opacity-100"
          style={{ 
            top: '3px',
            right: '3px',
            color: dayColors[0] // Usa a primeira cor para o emoji
          }}
        >
          🔥
        </span>
      )}
      
      {/* Indicadores de múltiplos treinos */}
      <div className="absolute bottom-1 flex justify-center space-x-1">
        {dayColors.map((color, index) => (
          <div 
            key={index}
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
})}
      </div>
    </div>
  );
};

export default CalendarioTreinos;