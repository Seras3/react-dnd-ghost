import { useRef } from "react"
import { GhostTokens } from "../types"
import { useGhostDNDBindTarget } from "../../lib"
import { StyledTargetElement } from "./target-element.styled"

interface TargetElementProps extends React.HTMLAttributes<HTMLDivElement> {
  token: GhostTokens
  title: string
}

const TargetElement = (props: TargetElementProps) => {
  const { token, title, onDrop, ...rest } = props

  const dropboxRef = useRef<HTMLDivElement>(null)
  useGhostDNDBindTarget(dropboxRef, token)

  return (
    <StyledTargetElement ref={dropboxRef} {...rest}>
      <h2>{title}</h2>
    </StyledTargetElement>
  )
}

export default TargetElement
