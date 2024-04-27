import { languagesType, tabType } from "./editor.interface"

export type EventsEmitter = {
	formatCode: { language: languagesType; tab: tabType }
	clearCode: { language: languagesType; tab: tabType }
	minifyCode: { language: languagesType; tab: tabType }
	userLoggedIn: { username: string; timestamp: Date }
}
