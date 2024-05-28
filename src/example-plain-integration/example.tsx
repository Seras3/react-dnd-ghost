import { useState } from "react"
import SourceElement from "./source-element/source-element"
import TargetElement from "./target-element/target-element"
import { StyledExample } from "./example.styled"

const Example = () => {
  const [sourceElements] = useState(["Source 1", "Source 2"])

  return (
    <StyledExample>
      <div className="source-group">
        {sourceElements.map((element, index) => (
          <SourceElement key={index} label={element} />
        ))}
      </div>
      <div className="target-group">
        <TargetElement
          token="over-target-1"
          title={"Target 1"}
          style={{
            position: "absolute",
            top: 100,
            left: 100,
            width: 200,
            height: 300,
            backgroundColor: "green",
          }}
        />
        <TargetElement
          token="over-target-2"
          title={"Target 2"}
          style={{
            position: "absolute",
            top: 50,
            left: 700,
            width: 200,
            height: 300,
            backgroundColor: "blue",
          }}
        />
      </div>
    </StyledExample>
  )
}

export default Example
