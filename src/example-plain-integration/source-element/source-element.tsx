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

        if (ghostToken === "over-target-1") {
          return (
            <StyledGhost1>Custom Ghost for {label} - over Target1</StyledGhost1>
          )
        }

        if (ghostToken === "over-target-2") {
          return (
            <StyledGhost2>Custom Ghost for {label} - over Target2</StyledGhost2>
          )
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
      {...props}
    >
      {label}
    </StyledSourceElement>
  )
}

export default SourceElement
