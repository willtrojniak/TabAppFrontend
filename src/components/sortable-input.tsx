import { DndContext, DragOverlay, DragStartEvent, DragOverEvent, UniqueIdentifier, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import React, { act } from "react";
import { Sortable } from "./ui/sortable";
import { Droppable } from "./ui/droppable";


export function SortableInput<T extends { id: UniqueIdentifier }>({ value, onChange, render, disabled = false, trashComponent }: {
  disabled?: boolean,
  value: T[],
  render: (item: T) => React.ReactNode
  onChange: (value: T[]) => void
  trashComponent?: React.ReactNode

}) {
  const trashId = "_sortable_trash"
  const [activeItem, setActiveItem] = React.useState<T | null>(null)

  const handleDragStart = React.useCallback(({ active }: DragStartEvent) => {
    setActiveItem(value.find(v => v.id === active.id)!)
  }, [value])

  const handleDragOver = React.useCallback(({ active, over }: DragOverEvent) => {
    if (over && active.id !== over.id && over.id !== trashId) {
      const oldIndex = value.findIndex(v => v.id === active.id)
      const newIndex = value.findIndex(v => v.id === over.id)
      onChange(arrayMove(value, oldIndex, newIndex))
    }
  }, [value, onChange])

  const handleDragEnd = React.useCallback(({ active, over }: DragEndEvent) => {
    setActiveItem(null)
    if (over && over.id === trashId) {
      onChange(value.filter(v => v.id !== active.id))
    }
  }, [value, onChange])

  return <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
    <SortableContext items={value}>
      {value.map((v) => (
        <Sortable key={v.id} id={v.id} disabled={disabled}>
          {render(v)}
        </Sortable>
      ))}
    </SortableContext>
    <Droppable id={"_sortable_trash"}>
      {activeItem && trashComponent}
    </Droppable>
    <DragOverlay>
      {activeItem && render(activeItem)}
    </DragOverlay>
  </DndContext>
}
