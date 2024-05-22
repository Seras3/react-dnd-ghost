import { useEffect, useRef } from "react"
import { useGhostDND } from "../../lib"
import "./source-element.css"
import { GhostTokens } from "../types"

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
            <div
              style={{
                color: "black",
                backgroundColor: "lime",
                padding: 16,
                borderRadius: 16,
              }}
            >
              Custom Ghost for {label} - over Target1
            </div>
          )
        }

        if (ghostToken === "over-target-2") {
          return (
            <div
              style={{
                color: "black",
                backgroundColor: "aqua",
                padding: 8,
                borderRadius: 8,
              }}
            >
              Custom Ghost for {label} - over Target2
            </div>
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
    <div
      ref={draggedElementRef}
      className={"source-element"}
      draggable
      {...props}
    >
      {label}
    </div>
  )
}

export default SourceElement
