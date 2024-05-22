import { useEffect, useRef } from "react"
import { GhostTokens } from "../types"
import "./target-element.css"
import { useGhostDND } from "../../lib"

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
    <div ref={dropboxRef} className={"target-element"} {...rest}>
      <h2>{title}</h2>
    </div>
  )
}

export default TargetElement
