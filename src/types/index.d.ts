export namespace Hangout {
	export type EventType =
		| "UNSPECIFIED"
		| "MESSAGE"
		| "ADDED_TO_SPACE"
		| "REMOVED_FROM_SPACE"
		| "CARD_CLICKED"

	export interface User {
		name: string
		displayName: string
		avatarUrl: string
		email: string
		type: "TYPE_UNSPECIFIED" | "HUMAN" | "BOT"
		domainId: string
	}

	export interface Space {
		name: string
		type: "TYPE_UNSPECIFIED" | "ROOM" | "DM"
		displayName: string
		threaded: boolean
	}

	export interface Annonation {
		name: string
		type: "ANNOTATION_TYPE_UNSPECIFIED" | "USER_MENTION"
		createTime: string
		text: string
		cards: Card[]
		previewText: string
		annotations: Annonation[]
		thread: Thread
		space: Space
		fallbackText: string
		actionResponse: any // todo
		argumentText: string
	}

	// todo
	export interface Card {}

	export interface Thread {
		name: string
		retentionSettings: any // todo
	}

	export interface Message {
		name: string
		sender: User
		createTime: string
		text: string
		annotations: Annonation[]
		thread: Thread
		space: Space
		argumentText: string
	}

	export interface Body {
		type: EventType
		eventTime: string
		message: Message
		user: User
		space: Space
		configCompleteRedirectUrl: string
		action: {
			actionMethodName: string
			parameters: any[]
		}
	}
}
