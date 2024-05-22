import "./app.css"
import { useState } from "react"
import ExampleFunctionalDND from "./example-functional-dnd/example"
import ExamplePlainIntegration from "./example-plain-integration/example"

import GhostDNDProvider from "./lib/react-dnd-ghost"

function App() {
  const [tab, setCurrentTab] = useState<"plain-integration" | "functional-dnd">(
    "plain-integration"
  )

  const renderExample = () => {
    switch (tab) {
      case "plain-integration":
        return <ExamplePlainIntegration />
      case "functional-dnd":
        return <ExampleFunctionalDND />
    }
  }

  return (
    <GhostDNDProvider>
      <div className="layout">
        <nav>
          <button
            onClick={() => setCurrentTab("plain-integration")}
            className={tab === "plain-integration" ? "active" : ""}
          >
            Plain integration
          </button>

          <button
            onClick={() => setCurrentTab("functional-dnd")}
            className={tab === "functional-dnd" ? "active" : ""}
          >
            Functional Drag&Drop
          </button>
        </nav>
        <main>{renderExample()}</main>
      </div>
    </GhostDNDProvider>
  )
}

export default App
