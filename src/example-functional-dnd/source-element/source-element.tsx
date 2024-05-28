import { useEffect, useRef } from "react"
import { useGhostDND } from "../../lib"
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

  const { setSourceConfig, setRenderGhost } = useGhostDND()

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("text/plain", label)
    event.dataTransfer.effectAllowed = "move"
  }

  useEffect(() => {
    const draggedElement = draggedElementRef.current
    if (!draggedElement) return

    const handleMouseDown = () => {
      setSourceConfig({ sourceElement: draggedElement })

      setRenderGhost((token) => {
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
    }

    draggedElement.addEventListener("mousedown", handleMouseDown)

    return () => {
      draggedElement.removeEventListener("mousedown", handleMouseDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
