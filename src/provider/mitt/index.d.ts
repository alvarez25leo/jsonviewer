import React from "react"
import { Emitter } from "mitt"
import { EventsEmitter } from "../../types"

export interface MittContextType {
	emitter: Emitter<EventsEmitter>
}

export declare const MittProvider: React.FC
export declare const useMitt: () => MittContextType
