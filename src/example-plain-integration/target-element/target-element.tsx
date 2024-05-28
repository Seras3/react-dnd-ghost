import { useEffect, useRef } from "react"
import { GhostTokens } from "../types"
import { useGhostDND } from "../../lib"
import { StyledTargetElement } from "./target-element.styled"

interface TargetElementProps extends React.HTMLAttributes<HTMLDivElement> {
  token: GhostTokens
  title: string
}

const TargetElement = (props: TargetElementProps) => {
  const { token, title, onDrop, ...rest } = props

  const { addDropTargetConfig, removeDropTarget } = useGhostDND()
  const dropboxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dropbox = dropboxRef.current
    if (!dropbox) return

    addDropTargetConfig({
      dropTargetElement: dropbox,
      token,
    })

    return () => {
      removeDropTarget(dropbox)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <StyledTargetElement ref={dropboxRef} {...rest}>
      <h2>{title}</h2>
    </StyledTargetElement>
  )
}

export default TargetElement
