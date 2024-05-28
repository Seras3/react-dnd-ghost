import { noop } from "./utils/noop"
import useDragMousePosition from "./hooks/use-drag-mouse-position"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"

export type SourceElement = HTMLElement

export type DropTargetElement = HTMLElement
export type RenderGhost = (token: string) => ReactNode

type SourceConfig = {
  sourceElement: SourceElement
}

type DropTargetConfig = {
  dropTargetElement: DropTargetElement
  token: string
  onDragEnter: (event: DragEvent) => void
  onDragLeave: (event: DragEvent) => void
}

type DropTargetConfigProps = Pick<
  DropTargetConfig,
  "dropTargetElement" | "token"
>

type TGhostDNDContext = {
  setSourceConfig: (config: SourceConfig) => void
  addDropTargetConfig: (config: DropTargetConfigProps) => void
  removeDropTarget: (target: DropTargetElement) => void
  setRenderGhost: (renderGhost: RenderGhost) => void
}

export const GhostDNDContext = createContext<TGhostDNDContext>({
  setSourceConfig: noop,
  addDropTargetConfig: noop,
  removeDropTarget: noop,
  setRenderGhost: noop,
})

export const useGhostDND = () => useContext(GhostDNDContext)

type Props = {
  children: ReactNode
}

const GHOST_CONTAINER_ID = "ghost-container"

const emptyDiv = document.createElement("div")
emptyDiv.style.height = "1px"
emptyDiv.style.width = "1px"

type DropTargetStackItem = {
  dropTargetElement: DropTargetElement
  count: number
}

const GhostDNDProvider = (props: Props) => {
  const [sourceConfig, setSourceConfig] = useState<SourceConfig>()

  const [renderGhost, setRenderGhost] = useState<RenderGhost>(() => () => (
    <div></div>
  ))
  const [token, setToken] = useState("")
  const [stackUpdates, setStackUpdates] = useState(0)
  const [configsUpdates, setConfigsUpdates] = useState(0)
  const flushStack = () => setStackUpdates((prev) => (prev + 1) % 10)
  const flushConfigs = () => setConfigsUpdates((prev) => (prev + 1) % 10)

  const dropTargetConfigsRef = useRef<Array<DropTargetConfig>>([])
  const dropTargetStackRef = useRef<Array<DropTargetStackItem>>([])

  const ghostContainerRef = useRef<HTMLDivElement>(
    document.createElement("div")
  )

  const mousePositionRef = useDragMousePosition()

  const getDropTargetToken = (target: DropTargetElement) =>
    dropTargetConfigsRef.current.find(
      ({ dropTargetElement: t }) => t === target
    )?.token

  const handleSetSourceConfig: TGhostDNDContext["setSourceConfig"] = ({
    sourceElement,
  }) => {
    setSourceConfig({ sourceElement })
  }

  const handleSetRenderGhost: TGhostDNDContext["setRenderGhost"] = (val) => {
    setRenderGhost(() => val)
  }

  const onDropTargetEnter = (target: DropTargetElement) => {
    const dropTargetStack = dropTargetStackRef.current

    const targetIndex = dropTargetStack.findIndex(
      (item) => item.dropTargetElement === target
    )

    if (targetIndex === -1) {
      dropTargetStackRef.current = [
        ...dropTargetStack,
        { count: 1, dropTargetElement: target },
      ]
      flushStack()
      return
    }

    dropTargetStackRef.current[targetIndex].count++
    flushStack()
  }

  const onDropTargetLeave = (target: DropTargetElement) => {
    const dropTargetStack = dropTargetStackRef.current

    const targetIndex = dropTargetStack.findIndex(
      (item) => item.dropTargetElement === target
    )
    if (targetIndex === -1) {
      throw Error("Try to remove node that is not in ghost stack.")
    }

    dropTargetStackRef.current[targetIndex].count--

    if (dropTargetStackRef.current[targetIndex].count === 0) {
      const prev = dropTargetStackRef.current
      dropTargetStackRef.current = [
        ...prev.slice(0, targetIndex),
        ...prev.slice(targetIndex + 1),
      ]
    }
    flushStack()
  }

  const handleAddDropTargetConfig: TGhostDNDContext["addDropTargetConfig"] = ({
    dropTargetElement,
    token,
  }) => {
    const dropTargetConfigs = dropTargetConfigsRef.current

    const targetIndex = dropTargetConfigs.findIndex(
      ({ dropTargetElement: t }) => t === dropTargetElement
    )

    const onDragEnter = (event: DragEvent) => {
      event.stopPropagation()
      onDropTargetEnter(dropTargetElement)
    }

    const onDragLeave = (event: DragEvent) => {
      event.stopPropagation()
      onDropTargetLeave(dropTargetElement)
    }

    if (targetIndex === -1) {
      dropTargetConfigsRef.current = [
        ...dropTargetConfigs,
        {
          dropTargetElement,
          token,
          onDragEnter,
          onDragLeave,
        },
      ]
      flushConfigs()
      return
    }

    dropTargetConfigsRef.current[targetIndex] = {
      dropTargetElement,
      token,
      onDragEnter,
      onDragLeave,
    }
    flushConfigs()
  }

  const handleRemoveDropTarget: TGhostDNDContext["removeDropTarget"] = (
    target
  ) => {
    const targetIndex = dropTargetConfigsRef.current.findIndex(
      ({ dropTargetElement: t }) => t === target
    )

    if (targetIndex === -1) {
      throw Error("You try to remove a drop target that is not in config.")
    }

    const prev = dropTargetConfigsRef.current
    dropTargetConfigsRef.current = [
      ...prev.slice(0, targetIndex),
      ...prev.slice(targetIndex + 1),
    ]
  }

  useEffect(() => {
    const ghostContainer = ghostContainerRef.current
    if (!sourceConfig || !ghostContainer) return
    const { sourceElement: draggedElement } = sourceConfig

    const handleDragStart = (event: DragEvent) => {
      document.body.appendChild(emptyDiv)
      event.dataTransfer?.setDragImage(emptyDiv, 0, 0)
    }

    const handleDrag = () => {
      const { x, y } = mousePositionRef.current

      ghostContainer.style.display = "block"
      ghostContainer.style.left = `${x}px`
      ghostContainer.style.top = `${y}px`

      if (x === 0 && y === 0) {
        ghostContainer.style.display = "none"
      }
    }

    const handleDragEnd = () => {
      ghostContainer.style.left = `-9999px`
      ghostContainer.style.display = "none"
      emptyDiv.remove()
      dropTargetStackRef.current = []
      setToken("")
      flushStack()
    }

    // To cancel dragend event animation (see: https://stackoverflow.com/questions/42991709/how-to-disable-dragend-animation-in-html5)
    const handleGlobalDragover = (event: DragEvent) => event.preventDefault()

    document.addEventListener("dragover", handleGlobalDragover)
    draggedElement.addEventListener("dragstart", handleDragStart)
    draggedElement.addEventListener("drag", handleDrag)
    draggedElement.addEventListener("dragend", handleDragEnd)

    return () => {
      document.removeEventListener("dragover", handleGlobalDragover)
      draggedElement.removeEventListener("dragstart", handleDragStart)
      draggedElement.removeEventListener("drag", handleDrag)
      draggedElement.removeEventListener("dragend", handleDragEnd)
      handleDragEnd()
    }
  }, [mousePositionRef, sourceConfig])

  useEffect(() => {
    const ghostContainer = ghostContainerRef.current
    if (!ghostContainer) return

    ghostContainer.id = GHOST_CONTAINER_ID
    ghostContainer.style.position = "absolute"
    ghostContainer.style.zIndex = "99999"
    ghostContainer.style.pointerEvents = "none"
    document.body.appendChild(ghostContainer)

    return () => {
      ghostContainer.remove()
    }
  }, [])

  useEffect(() => {
    const dropTargetConfigs = dropTargetConfigsRef.current

    dropTargetConfigs.forEach((config) => {
      config.dropTargetElement.addEventListener("dragenter", config.onDragEnter)
      config.dropTargetElement.addEventListener("dragleave", config.onDragLeave)
    })

    return () => {
      dropTargetConfigs.forEach((config) => {
        config.dropTargetElement.removeEventListener(
          "dragenter",
          config.onDragEnter
        )
        config.dropTargetElement.removeEventListener(
          "dragleave",
          config.onDragLeave
        )
      })
    }
  }, [configsUpdates])

  useEffect(() => {
    const dropTargetStack = dropTargetStackRef.current

    if (dropTargetStack.length === 0) {
      setToken("")
      return
    }

    const targetElement =
      dropTargetStack[dropTargetStack.length - 1].dropTargetElement

    const token = getDropTargetToken(targetElement)

    if (!token) {
      throw Error("No token set for element.")
    }

    setToken(token)
  }, [stackUpdates])

  return (
    <GhostDNDContext.Provider
      value={{
        setSourceConfig: handleSetSourceConfig,
        addDropTargetConfig: handleAddDropTargetConfig,
        removeDropTarget: handleRemoveDropTarget,
        setRenderGhost: handleSetRenderGhost,
      }}
    >
      {props.children}
      {createPortal(renderGhost(token), ghostContainerRef.current)}
    </GhostDNDContext.Provider>
  )
}

export default GhostDNDProvider
