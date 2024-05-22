import { useEffect, useRef } from "react"

/**
 *  This hook is a workaround to support Firefox browser. (see: https://bugzilla.mozilla.org/show_bug.cgi?id=505521)
 */
const useDragMousePosition = () => {
  const mousePositionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (ev: DragEvent) => {
      mousePositionRef.current = { x: ev.clientX, y: ev.clientY }
    }

    document.addEventListener("dragover", updateMousePosition)
    return () => {
      document.removeEventListener("dragover", updateMousePosition)
    }
  }, [])

  return mousePositionRef
}
export default useDragMousePosition
