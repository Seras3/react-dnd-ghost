import { RefObject, useEffect, useRef, useState } from "react"
import { DropTargetElement, useGhostDND } from "./react-dnd-ghost"

export const useGhostDNDBindTarget = (
  dropTargetElementRef: RefObject<DropTargetElement>,
  token: string
) => {
  const { addDropTargetConfig, removeDropTarget } = useGhostDND()

  const dragEnterCountRef = useRef(0)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  useEffect(() => {
    const dropTargetElement = dropTargetElementRef.current
    if (!dropTargetElement) return

    addDropTargetConfig({
      dropTargetElement: dropTargetElement,
      token,
    })

    const onDragEnter = (event: DragEvent) => {
      event.stopPropagation()
      dragEnterCountRef.current++
      if (dragEnterCountRef.current === 1) {
        setIsDraggingOver(true)
      }
    }

    const onDragLeave = (event: DragEvent) => {
      event.stopPropagation()
      dragEnterCountRef.current--
      if (dragEnterCountRef.current === 0) {
        setIsDraggingOver(false)
      }
    }

    const onDrop = () => {
      setIsDraggingOver(false)
      dragEnterCountRef.current = 0
    }

    dropTargetElement.addEventListener("dragenter", onDragEnter)
    dropTargetElement.addEventListener("dragleave", onDragLeave)
    dropTargetElement.addEventListener("drop", onDrop)

    return () => {
      removeDropTarget(dropTargetElement)

      dropTargetElement.removeEventListener("dragenter", onDragEnter)
      dropTargetElement.removeEventListener("dragleave", onDragLeave)
      dropTargetElement.removeEventListener("drop", onDrop)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isDraggingOver
}
