import { useState } from "react"
import "./example.css"
import SourceElement from "./source-element/source-element"
import TargetElement from "./target-element/target-element"

const Example = () => {
  const [sourceElements, setSourceElements] = useState(["Source 1", "Source 2"])

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const data = event.dataTransfer.getData("text/plain")
    setSourceElements((prev) => prev.filter((elem) => elem !== data))
  }

  return (
    <>
      <div className="source-group">
        {sourceElements.map((element, index) => (
          <SourceElement key={index} label={element} />
        ))}
      </div>
      <div className="target-group">
        <TargetElement
          token="ghost-1"
          onDrop={onDrop}
          title={"Target 1"}
          styleType="t1"
          style={{
            position: "absolute",
            top: 100,
            left: 100,
            width: 200,
            height: 300,
          }}
        />
        <TargetElement
          token="ghost-2"
          onDrop={onDrop}
          title="Target 2"
          styleType="t1"
          style={{
            position: "absolute",
            top: 50,
            left: 700,
            width: 500,
            height: 400,
          }}
        >
          <TargetElement
            token="ghost-1"
            title="Child target"
            onDrop={onDrop}
            styleType="t2"
            style={{
              padding: 20,
            }}
          />
        </TargetElement>
      </div>
    </>
  )
}

export default Example
