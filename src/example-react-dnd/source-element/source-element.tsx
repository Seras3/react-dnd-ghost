import {
  StyledGhost1,
  StyledGhost2,
  StyledSourceElement,
} from "./source-element.styled"
import { useMultiDrag } from "react-dnd-multi-backend"
import { GhostTokens } from "../types"
import { useGhostDNDMultiBindSource } from "../../lib/use-ghost-dnd-multi-bind-source"

interface SourceElementProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
}

const SourceElement = (props: SourceElementProps) => {
  const { label } = props

  const [[dragProps, dragSource, preview]] = useMultiDrag({
    type: "card",
    item: { label },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      }
    },
  })

  useGhostDNDMultiBindSource(dragProps.isDragging, preview, (token) => {
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
    <StyledSourceElement ref={dragSource} {...props}>
      {label}
    </StyledSourceElement>
  )
}

export default SourceElement
