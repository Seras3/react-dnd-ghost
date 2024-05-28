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
