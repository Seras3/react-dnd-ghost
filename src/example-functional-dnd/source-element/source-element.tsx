import { useRef } from "react"
import { useGhostDNDBindSource } from "../../lib"
import { GhostTokens } from "../types"
import {
  StyledGhost1,
  StyledGhost2,
  StyledSourceElement,
} from "./source-element.styled"

interface SourceElementProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
}

const SourceElement = (props: SourceElementProps) => {
  const { label } = props

  const draggedElementRef = useRef<HTMLDivElement>(null)

  useGhostDNDBindSource(draggedElementRef, (token) => {
    const ghostToken = token as GhostTokens | ""
    if (ghostToken === "") {
      return <SourceElement {...props} />
    }

    if (ghostToken === "ghost-1") {
      return <StyledGhost1>Custom Ghost dragging: {label}</StyledGhost1>
    }

    if (ghostToken === "ghost-2") {
      return <StyledGhost2>Custom Ghost dragging: {label}</StyledGhost2>
    }
  })

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("text/plain", label)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <StyledSourceElement
      ref={draggedElementRef}
      className={"source-element"}
      draggable
      onDragStart={onDragStart}
      {...props}
    >
      {label}
    </StyledSourceElement>
  )
}

export default SourceElement
