import { useEffect } from "react"
import { RenderGhost } from "./react-dnd-ghost"
import { ConnectableElement, DragPreviewOptions } from "react-dnd"
import { getEmptyImage } from "react-dnd-html5-backend/dist/getEmptyImage"
import { useGhostDNDMulti } from "./react-dnd-ghost-multi"

type PreviewFn = (
  elementOrNode: ConnectableElement,
  options?: DragPreviewOptions | undefined
) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null

export const useGhostDNDMultiBindSource = (
  isDragging: boolean,
  preview: PreviewFn,
  renderGhost: RenderGhost
) => {
  const { setRenderGhost } = useGhostDNDMulti()

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isDragging) {
      setRenderGhost(renderGhost)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging])
}
