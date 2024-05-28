import { RefObject, useEffect } from "react"
import { RenderGhost, SourceElement, useGhostDND } from "./react-dnd-ghost"

export const useGhostDNDBindSource = (
  sourceElementRef: RefObject<SourceElement>,
  renderGhost: RenderGhost
) => {
  const { setSourceConfig, setRenderGhost } = useGhostDND()

  useEffect(() => {
    const sourceElement = sourceElementRef.current
    if (!sourceElement) return

    const handleMouseDown = () => {
      setSourceConfig({ sourceElement })
      setRenderGhost(renderGhost)
    }

    sourceElement.addEventListener("mousedown", handleMouseDown)

    return () => {
      sourceElement.removeEventListener("mousedown", handleMouseDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
