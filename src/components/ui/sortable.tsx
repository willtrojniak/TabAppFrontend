import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities'

export function Sortable({ element, id, children, disabled = false }: {
  disabled?: boolean,
  element?: React.ElementType
  id: UniqueIdentifier,
  children: React.ReactNode
}) {

  const Element = element ?? 'div';
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return disabled ? <Element>
    {children}
  </Element>
    :
    <Element ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </Element >
}
