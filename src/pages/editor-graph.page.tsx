import React, { useState, useMemo } from "react"
import JsonEditorComponent from "@/components/editor/json-editor.component"
import JsonGraphComponent from "@/components/graph/json-graph.component"
import ModalControllerComponent from "@/components/container/modal-controller.component"
import useFile from "@/store/useFile"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"

const EditorGraphPage = () => {
    const contents = useFile((s) => s.contents)

    // read saved sizes from localStorage or default to 50/50
    const saved = useMemo(() => {
        try {
            const raw = localStorage.getItem("editorGraphPanelSizes")
            if (raw) return JSON.parse(raw) as number[]
        } catch (e) {
            // ignore
        }
        return [50, 50]
    }, [])

    const [sizes, setSizes] = useState<number[]>(saved)
    const [hover, setHover] = useState(false)

    const handleLayout = (newSizes: number[]) => {
        setSizes(newSizes)
        try {
            localStorage.setItem("editorGraphPanelSizes", JSON.stringify(newSizes))
        } catch (e) {
            // ignore quota errors
        }
    }

    return (
        <div style={{ height: "100vh", width: "100vw" }}>
            <PanelGroup direction="horizontal" onLayout={handleLayout}>
                <Panel defaultSize={sizes[0]} minSize={20}>
                    <div style={{ height: "100%", borderRight: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
                        <JsonEditorComponent language={"json"} showSidebar={false} />
                    </div>
                </Panel>

                <PanelResizeHandle
                    style={{ width: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'col-resize' }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <div
                        style={{
                            width: 4,
                            height: '48%',
                            background: hover ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)',
                            borderRadius: 3,
                            transition: 'background 120ms ease',
                        }}
                    />
                </PanelResizeHandle>

                <Panel defaultSize={sizes[1]} minSize={20}>
                    <div style={{ height: "100%", overflow: "hidden", position: "relative" }}>
                        <JsonGraphComponent json={contents} />
                    </div>
                </Panel>
            </PanelGroup>
            <ModalControllerComponent />
        </div>
    )
}

export default EditorGraphPage
