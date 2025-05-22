import { useState, useEffect, useMemo } from 'react';

export interface ExercicioOption {
  id: number;
  nome: string;
  name: string; 
}

interface SelectExercicioProps {
  onSelect: (exercicioId: number | null) => void;
  selectedId?: number | null;
  initialValue?: ExercicioOption;
}

export function SelectExercicio({ onSelect, selectedId, initialValue }: SelectExercicioProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [allExercicios, setAllExercicios] = useState<ExercicioOption[]>([]);
  const [selectedExercicio, setSelectedExercicio] = useState<ExercicioOption | null>(initialValue || null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Carrega todos os exercícios inicialmente
  useEffect(() => {
    const fetchAllExercicios = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/letsgo/exercicios');
        const data = await response.json();
        setAllExercicios(data.exercicios);
        
        // Carrega o exercício selecionado inicial se houver ID mas não o objeto completo
        if (selectedId && !initialValue) {
          const exercicio = data.exercicios.find((e: ExercicioOption) => e.id === selectedId);
          if (exercicio) {
            setSelectedExercicio(exercicio);
            setSearchTerm(getDisplayName(exercicio));
          }
        }
      } catch (error) {
        console.error("Erro ao buscar exercícios: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllExercicios();
  }, [selectedId, initialValue]);

  // Filtra exercícios baseado no termo de busca (ambos idiomas)
  const filteredExercicios = useMemo(() => {
    if (!searchTerm) return allExercicios;
    
    const term = searchTerm.toLowerCase();
    return allExercicios.filter(ex => 
      ex.nome?.toLowerCase().includes(term) ||
      ex.name?.toLowerCase().includes(term)
    );
  }, [searchTerm, allExercicios]);

  // Determina o nome de exibição baseado no idioma do usuário
  const getDisplayName = (exercicio: ExercicioOption) => {
    // Implemente sua lógica de detecção de idioma aqui
    const userLanguage = navigator.language.startsWith('pt') ? 'pt' : 'en';
    return userLanguage === 'pt' ? exercicio.nome : exercicio.name;
  };

  const handleSelect = (exercicio: ExercicioOption) => {
    setSelectedExercicio(exercicio);
    onSelect(exercicio.id);
    setSearchTerm(getDisplayName(exercicio));
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Se tinha um exercício selecionado e o usuário alterou o texto, limpa a seleção
    if (selectedExercicio && value !== getDisplayName(selectedExercicio)) {
      setSelectedExercicio(null);
      onSelect(null);
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">Exercício</label>
      <input
        type="text"
        placeholder="Buscar exercício..."
        value={selectedExercicio ? getDisplayName(selectedExercicio) : searchTerm}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />

      {isLoading && <div className="text-sm text-gray-500">Carregando...</div>}
      
      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
          {filteredExercicios.length === 0 ? (
            <div className="p-2 text-gray-500">Nenhum exercício encontrado</div>
          ) : (
            filteredExercicios.map(exercicio => (
              <div
                key={exercicio.id}
                className={`p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center ${
                  selectedId === exercicio.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSelect(exercicio)}
              >
                <span>{getDisplayName(exercicio)}</span>
                <span className="text-xs text-gray-400 ml-2">
                  {getDisplayName(exercicio) === exercicio.nome ? exercicio.name : exercicio.nome}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}