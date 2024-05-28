import { useEffect, useRef, useState } from "react"
import { GhostTokens } from "../types"
import { useGhostDND } from "../../lib"
import {
  StyledTargetElement,
  StyledTargetElementProps,
} from "./target-element.styled"

interface TargetElementProps extends React.HTMLAttributes<HTMLDivElement> {
  token: GhostTokens
  title: string
  styleType: StyledTargetElementProps["variant"]
}

const TargetElement = (props: TargetElementProps) => {
  const { token, title, onDrop, styleType, children, ...rest } = props

  const [elements, setElements] = useState<Array<string>>([])

  const { addDropTargetConfig, removeDropTarget } = useGhostDND()
  const dropboxRef = useRef<HTMLDivElement>(null)

  const dragEnterCountRef = useRef(0)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  const handleOnDrop = (event: React.DragEvent<HTMLDivElement>) => {
    onDrop?.(event)

    setIsDraggingOver(false)
    dragEnterCountRef.current = 0

    const data = event.dataTransfer.getData("text/plain")
    setElements((prev) => [...prev, data])
  }

  useEffect(() => {
    const dropbox = dropboxRef.current
    if (!dropbox) return

    addDropTargetConfig({
      dropTargetElement: dropbox,
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

    dropbox.addEventListener("dragenter", onDragEnter)
    dropbox.addEventListener("dragleave", onDragLeave)

    return () => {
      removeDropTarget(dropbox)

      dropbox.removeEventListener("dragenter", onDragEnter)
      dropbox.removeEventListener("dragleave", onDragLeave)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <StyledTargetElement
      ref={dropboxRef}
      variant={styleType}
      className={isDraggingOver ? "drag-over" : ""}
      onDrop={handleOnDrop}
      {...rest}
    >
      <h2>{title}</h2>
      <div>
        {elements.map((value, index) => (
          <p key={index}>{value}</p>
        ))}
      </div>
      {children}
    </StyledTargetElement>
  )
}

export default TargetElement
