import type { CSSProperties, ReactNode } from "react"
import type { XYCoord } from "react-dnd"

import { useDragDropManager, useDragLayer } from "react-dnd"

const layerStyles: CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
}

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    }
  }

  const { x, y } = currentOffset

  const transform = `translate(${x}px, ${y}px)`

  return {
    display: "flex",
    transform,
    WebkitTransform: transform,
  }
}

interface CustomDragLayerProps {
  renderItem: () => ReactNode
  cleanToken: () => void
}

export const CustomDragLayer = (props: CustomDragLayerProps) => {
  const dragLayer = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  const { initialOffset, currentOffset, isDragging } = dragLayer

  const manager = useDragDropManager()
  const targetIds = manager.getMonitor().getTargetIds()
  if (targetIds.length === 0) {
    props.cleanToken()
  }

  if (!isDragging) {
    return null
  }

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        {props.renderItem()}
      </div>
    </div>
  )
}
