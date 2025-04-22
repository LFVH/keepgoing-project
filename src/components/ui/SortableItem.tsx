'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function SortableItem({
  id,
  execucao,
}: {
  id: number;
  execucao: any;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: 'item',
      execucao,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 0,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={isDragging ? 'bg-blue-50' : 'hover:bg-gray-50'}
    >
      <td className="p-2">{execucao.ordem}</td>
      <td className="p-2">{execucao.reps}</td>
      <td className="p-2">{execucao.sets}</td>
    </tr>
  );
}