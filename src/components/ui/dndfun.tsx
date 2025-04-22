import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
  } from '@dnd-kit/core';
  import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
  } from '@dnd-kit/sortable';
  import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
  import { SortableItem } from './SortableItem'; // Criaremos este componente depois
  
  export function SeuComponente() {
    const [execucoesAgrupadas, setExecucoesAgrupadas] = useState(execucoesPorExercicio);
  
    // Configura sensores (mouse/toque/teclado)
    const sensors = useSensors(
      useSensor(PointerSensor), // Arrastar com mouse/toque
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates, // Suporte a teclado
      })
    );
  
    // Função chamada quando o drag termina
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
  
      if (!over || active.id === over.id) return;
  
      // Encontra o exercício onde ocorreu o drag
      const exercicioId = parseInt(over.data.current?.droppableId || '0');
      const exercicioIndex = execucoesAgrupadas.findIndex(e => e.exercicio.id === exercicioId);
  
      if (exercicioIndex === -1) return;
  
      const execucoes = [...execucoesAgrupadas[exercicioIndex].execucoes];
      const oldIndex = execucoes.findIndex(e => e.id === active.id);
      const newIndex = execucoes.findIndex(e => e.id === over.id);
  
      if (oldIndex === -1 || newIndex === -1) return;
  
      // Reordena o array
      const [movedExecucao] = execucoes.splice(oldIndex, 1);
      execucoes.splice(newIndex, 0, movedExecucao);
  
      // Atualiza a ordem numérica (opcional)
      execucoes.forEach((exec, index) => {
        exec.ordem = index + 1;
      });
  
      // Atualiza o estado
      const newAgrupadas = [...execucoesAgrupadas];
      newAgrupadas[exercicioIndex].execucoes = execucoes;
      setExecucoesAgrupadas(newAgrupadas);
  
      // Aqui você pode chamar uma API para salvar a nova ordem no backend
      // await api.updateOrdemExecucoes(execucoes);
    };
  
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]} // Restringe ao eixo vertical
      >
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Exercícios do Treino</h3>
          
          {execucoesAgrupadas.map(({ exercicio, execucoes }) => (
            <div key={exercicio.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">{exercicio.nome}</h4>
                <button
                  type="button"
                  onClick={() => handleOpenAddExecucao(exercicio)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  +
                </button>
              </div>
  
              <SortableContext
                items={execucoes.map(e => e.id)} // IDs únicos para cada execução
                strategy={verticalListSortingStrategy}
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th>Ordem</th>
                        <th>Reps</th>
                        <th>Sets</th>
                        {/* ... outros cabeçalhos */}
                      </tr>
                    </thead>
                    <tbody>
                      {execucoes.map((execucao) => (
                        <SortableItem key={execucao.id} id={execucao.id} execucao={execucao} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
    );
  }