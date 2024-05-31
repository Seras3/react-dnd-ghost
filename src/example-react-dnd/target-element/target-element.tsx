import { useState } from "react"
import { GhostTokens } from "../types"

import { StyledTargetElement } from "./target-element.styled"
import { useMultiDrop } from "react-dnd-multi-backend"
import { useGhostDNDMulti } from "../../lib/react-dnd-ghost-multi"

interface TargetElementProps extends React.HTMLAttributes<HTMLDivElement> {
  token: GhostTokens
  title: string
}

const TargetElement = (props: TargetElementProps) => {
  const { token, title, onDrop, children, ...rest } = props

  const [elements, setElements] = useState<Array<string>>([])

  const { setToken } = useGhostDNDMulti()
  const [[dropProp, dropRef]] = useMultiDrop({
    accept: "card",
    drop: (item) => {
      setElements((prev) => [...prev, (item as { label: string }).label])
    },
    collect: (monitor) => {
      return {
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
        data: monitor.getItem() as { label: string } | null,
      }
    },
    canDrop: (_, monitor) => monitor.isOver({ shallow: true }),
    hover: (_, monitor) => {
      if (monitor.isOver({ shallow: true })) {
        setToken(token)
      }
    },
  })

  return (
    <StyledTargetElement ref={dropRef} {...rest}>
      <h2>{title}</h2>
      <div>
        {elements.map((value, index) => (
          <p key={index}>{value}</p>
        ))}
        {dropProp.data && dropProp.isOver && <div>{dropProp.data.label}</div>}
      </div>
      {children}
    </StyledTargetElement>
  )
}

export default TargetElement
