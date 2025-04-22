'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect } from 'react';

export default function SortableGroup({
  id,
  grupo,
  children,
}: {
  id: number;
  grupo: any;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({
    id,
    data: {
      type: 'group',
      grupo,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 999 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative group"
    >
      <div
        ref={setActivatorNodeRef}
        {...listeners}
        className="absolute top-2 right-2 p-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        ≡
      </div>
      {children}
    </div>
  );
}