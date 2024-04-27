import React, { useContext, ReactNode } from "react"
import mitt, { Emitter } from "mitt"
import { EventsEmitter } from "@/types"

const emitter: Emitter<EventsEmitter> = mitt<EventsEmitter>()

export interface MittContextType {
	emitter: Emitter<EventsEmitter>
}

const MittContext = React.createContext<MittContextType>({ emitter })

interface MittProviderProps {
	children: ReactNode
}

export const MittProvider: React.FC<MittProviderProps> = ({ children }) => {
	return <MittContext.Provider value={{ emitter }}>{children}</MittContext.Provider>
}

export const useMitt = (): MittContextType => useContext(MittContext)
