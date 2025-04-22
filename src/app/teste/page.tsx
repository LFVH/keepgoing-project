'use client';
import { useState, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
  defaultDropAnimation,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableGroup from '@/components/ui/SortableGrupo';
import SortableItem from '@/components/ui/SortableItem';


export type Execucao = {
    id: number;
    ordem: number;
    reps: number;
    sets: number;
    comentario?: string;
  };
  
  export type Exercicio = {
    id: number;
    nome: string;
  };
  
  export type GrupoExercicio = {
    id: number;
    ordem: number;
    exercicio: Exercicio;
    execucoes: Execucao[];
  };

export default function TreinoPage() {
  const [grupos, setGrupos] = useState([
    {
      id: 1,
      ordem: 1,
      exercicio: { id: 1, nome: 'Supino' },
      execucoes: [
        { id: 1, ordem: 1, reps: 10, sets: 3 },
        { id: 2, ordem: 2, reps: 8, sets: 3 },
      ],
    },
    {
      id: 2,
      ordem: 2,
      exercicio: { id: 2, nome: 'Agachamento' },
      execucoes: [
        { id: 3, ordem: 1, reps: 12, sets: 4 },
        { id: 4, ordem: 2, reps: 10, sets: 4 },
      ],
    },
  ]);

  // Otimização: memoize os IDs para evitar re-renders desnecessários
  const groupIds = useMemo(() => grupos.map(g => g.id), [grupos]);

  const [activeGroup, setActiveGroup] = useState<GrupoExercicio | null>(null);
  const [activeItem, setActiveItem] = useState<Execucao | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
    if (active.data.current?.type === 'group') {
      setActiveGroup(active.data.current.grupo as GrupoExercicio);
      return;
    }
  
    if (active.data.current?.type === 'item') {
      setActiveItem(active.data.current.execucao as Execucao);
    }
  };
  

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveGroup(null);
      setActiveItem(null);
      return;
    }

    // Reordenar GRUPOS
    if (active.data.current?.type === 'group' && over.data.current?.type === 'group') {
      setGrupos(prevGrupos => {
        const oldIndex = prevGrupos.findIndex(g => g.id === active.id);
        const newIndex = prevGrupos.findIndex(g => g.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return prevGrupos;

        const newGrupos = arrayMove(prevGrupos, oldIndex, newIndex);

        // Atualiza a ordem numérica
        return newGrupos.map((grupo, index) => ({
          ...grupo,
          ordem: index + 1,
        }));
      });
    }

    // Reordenar ITENS dentro do mesmo grupo
    if (active.data.current?.type === 'item' && over.data.current?.type === 'item') {
      setGrupos(prevGrupos => {
        const grupoIndex = prevGrupos.findIndex(g => 
          g.execucoes.some(e => e.id === active.id || e.id === over.id)
        );

        if (grupoIndex === -1) return prevGrupos;

        const grupo = prevGrupos[grupoIndex];
        const oldIndex = grupo.execucoes.findIndex(e => e.id === active.id);
        const newIndex = grupo.execucoes.findIndex(e => e.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return prevGrupos;

        const newExecucoes = arrayMove(grupo.execucoes, oldIndex, newIndex);

        // Atualiza a ordem numérica
        const execucoesAtualizadas = newExecucoes.map((exec, index) => ({
          ...exec,
          ordem: index + 1,
        }));

        const newGrupos = [...prevGrupos];
        newGrupos[grupoIndex] = {
          ...grupo,
          execucoes: execucoesAtualizadas,
        };

        return newGrupos;
      });
    }

    setActiveGroup(null);
    setActiveItem(null);
  };

  const dropAnimation = {
    ...defaultDropAnimation,
    dragSourceOpacity: 0.5,
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={groupIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {grupos.map(grupo => (
              <SortableGroup
                key={`group-${grupo.id}`}
                id={grupo.id}
                grupo={grupo}
              >
                <div className="p-4 border rounded-lg bg-white shadow-sm relative">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-lg">
                      {grupo.exercicio.nome}
                    </h3>
                    <span className="text-sm text-gray-500">
                      Ordem: {grupo.ordem}
                    </span>
                  </div>

                  <SortableContext
                    items={grupo.execucoes.map(e => e.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="p-2">Ordem</th>
                          <th className="p-2">Reps</th>
                          <th className="p-2">Sets</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grupo.execucoes.map(execucao => (
                          <SortableItem
                            key={`item-${execucao.id}`}
                            id={execucao.id}
                            execucao={execucao}
                          />
                        ))}
                      </tbody>
                    </table>
                  </SortableContext>
                </div>
              </SortableGroup>
            ))}
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={dropAnimation}>
  {activeGroup && (
    <div className="p-4 border rounded-lg bg-white shadow-lg opacity-90">
      <h3 className="font-medium text-lg">
        {activeGroup.exercicio.nome}
      </h3>
    </div>
  )}
  {activeItem && (
    <table className="w-full bg-white shadow-lg opacity-90">
      <tbody>
        <tr>
          <td className="p-2">{activeItem.ordem}</td>
          <td className="p-2">{activeItem.reps}</td>
          <td className="p-2">{activeItem.sets}</td>
        </tr>
      </tbody>
    </table>
  )}
</DragOverlay>
      </DndContext>
    </div>
  );
}