import { DndContext, DragOverlay, DragStartEvent, DragOverEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import React from "react";
import { Sortable } from "./ui/sortable";


export function SortableInput<T extends { id: UniqueIdentifier }>({ value, onChange, render, disabled = false }: {
  disabled?: boolean,
  value: T[],
  render: (item: T) => React.ReactNode
  onChange: (value: T[]) => void

}) {
  const [activeItem, setActiveItem] = React.useState<T | null>(null)

  const handleDragStart = React.useCallback(({ active }: DragStartEvent) => {
    setActiveItem(value.find(v => v.id === active.id)!)
  }, [value])

  const handleDragOver = React.useCallback(({ active, over }: DragOverEvent) => {
    if (over && active.id !== over.id) {
      const oldIndex = value.findIndex(v => v.id === active.id)
      const newIndex = value.findIndex(v => v.id === over.id)
      onChange(arrayMove(value, oldIndex, newIndex))
    }
  }, [value, onChange])

  const handleDragEnd = React.useCallback(() => {
    setActiveItem(null)
  }, [])

  return <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
    <SortableContext items={value}>
      {value.map((v) => (
        <Sortable key={v.id} id={v.id} disabled={disabled}>
          {render(v)}
        </Sortable>
      ))}
    </SortableContext>
    <DragOverlay>
      {activeItem && render(activeItem)}
    </DragOverlay>
  </DndContext>
}
