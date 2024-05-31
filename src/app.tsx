import "./app.css"
import { useState } from "react"
import ExampleFunctionalDND from "./example-functional-dnd/example"
import ExamplePlainIntegration from "./example-plain-integration/example"
import ExampleReactDND from "./example-react-dnd/example"

import GhostDNDProvider from "./lib/react-dnd-ghost"
import { DndProvider } from "react-dnd-multi-backend"
import { HTML5toTouch } from "rdndmb-html5-to-touch"
import GhostDNDMultiProvider from "./lib/react-dnd-ghost-multi"

function App() {
  const [tab, setCurrentTab] = useState<
    "plain-integration" | "functional-dnd" | "react-dnd"
  >("plain-integration")

  const renderExample = () => {
    switch (tab) {
      case "plain-integration":
        return <ExamplePlainIntegration />
      case "functional-dnd":
        return <ExampleFunctionalDND />
      case "react-dnd":
        return (
          <DndProvider options={HTML5toTouch}>
            <GhostDNDMultiProvider>
              <ExampleReactDND />
            </GhostDNDMultiProvider>
          </DndProvider>
        )
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

          <button
            onClick={() => setCurrentTab("react-dnd")}
            className={tab === "react-dnd" ? "active" : ""}
          >
            React DND
          </button>
        </nav>
        <main>{renderExample()}</main>
      </div>
    </GhostDNDProvider>
  )
}

export default App
