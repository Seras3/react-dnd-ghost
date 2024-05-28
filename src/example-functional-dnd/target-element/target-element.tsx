import { useRef, useState } from "react"
import { GhostTokens } from "../types"
import { useGhostDNDBindTarget } from "../../lib"
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

  const dropboxRef = useRef<HTMLDivElement>(null)
  const isDraggingOver = useGhostDNDBindTarget(dropboxRef, token)

  const handleOnDrop = (event: React.DragEvent<HTMLDivElement>) => {
    onDrop?.(event)
    const data = event.dataTransfer.getData("text/plain")
    setElements((prev) => [...prev, data])
  }

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
