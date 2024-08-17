import React from 'react'
import { ReactSelect } from './react-select'
import { ContainerProps, MultiValueGenericProps, components } from 'react-select'
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

function SortableMultiValueContainer<T>(props: MultiValueGenericProps<T, true>) {
  const v = props.selectProps.getOptionValue(props.data)
  const { attributes, setNodeRef, transform, transition } = useSortable({ id: v })
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }
  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }
  const innerProps = { ...props.innerProps, onMouseDown }
  return <div ref={setNodeRef} style={style} {...attributes} ><components.MultiValueContainer {...props} innerProps={innerProps} /> </div>
}

function SortableMultiValueLabel<T>(props: MultiValueGenericProps<T, true>) {
  const v = props.selectProps.getOptionValue(props.data)
  const { listeners } = useSortable({ id: v })
  return <div {...listeners} className='text-center'><components.MultiValueLabel {...props} /></div>
}

function SortableSelectContainer<T>(props: ContainerProps<T, true>) {
  const items = React.useMemo(() => {
    return props.getValue().map(v => props.selectProps.getOptionValue(v))
  }, [props.getValue()])
  const handleDragOver = React.useCallback((e: DragEndEvent) => {
    const { active, over } = e
    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string)
      const newIndex = items.indexOf(over.id as string)
      props.selectProps.onChange(arrayMove(props.getValue().map(t => t), oldIndex, newIndex), { action: 'select-option', option: undefined })
    }
  }, [props, items])

  return <DndContext onDragOver={handleDragOver}>
    <SortableContext items={items} strategy={rectSortingStrategy}>
      <components.SelectContainer {...props} />
    </SortableContext>
  </DndContext>
}


export const SortableMultiSelect = React.forwardRef<React.ElementRef<typeof ReactSelect>, React.ComponentPropsWithoutRef<typeof ReactSelect>>((props, ref) => {

  return <ReactSelect
    {...props}
    ref={ref}
    isMulti
    options={props.options}
    components={{
      SelectContainer: SortableSelectContainer,
      MultiValueContainer: SortableMultiValueContainer,
      MultiValueLabel: SortableMultiValueLabel
    }}
    styles={{
    }}

  />
});
