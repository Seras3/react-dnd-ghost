import { createContext, ReactNode, useContext, useRef, useState } from "react"
import { noop } from "./utils/noop"
import { CustomDragLayer } from "./custom-drag-layer"

export type RenderGhost = (token: string) => ReactNode

type TGhostDNDMultiContext = {
  setRenderGhost: (renderGhost: RenderGhost) => void
  setToken: (token: string) => void
}

export const GhostDNDMultiContext = createContext<TGhostDNDMultiContext>({
  setRenderGhost: noop,
  setToken: noop,
})

export const useGhostDNDMulti = () => useContext(GhostDNDMultiContext)

type Props = {
  children: ReactNode
}

const emptyDiv = document.createElement("div")
emptyDiv.style.height = "1px"
emptyDiv.style.width = "1px"

const GhostDNDMultiProvider = (props: Props) => {
  const [token, setToken] = useState("")

  const currentTokenRef = useRef("")

  const [renderGhost, setRenderGhost] = useState<RenderGhost>(() => () => (
    <div />
  ))

  const handleSetRenderGhost: TGhostDNDMultiContext["setRenderGhost"] = (
    val
  ) => {
    setRenderGhost(() => val)
  }

  const handleSetToken: TGhostDNDMultiContext["setToken"] = (token) => {
    if (currentTokenRef.current !== token) {
      currentTokenRef.current = token
      setToken(token)
    }
  }

  return (
    <GhostDNDMultiContext.Provider
      value={{
        setRenderGhost: handleSetRenderGhost,
        setToken: handleSetToken,
      }}
    >
      <CustomDragLayer
        renderItem={() => renderGhost(token)}
        cleanToken={() => handleSetToken("")}
      />

      {props.children}
    </GhostDNDMultiContext.Provider>
  )
}

export default GhostDNDMultiProvider
