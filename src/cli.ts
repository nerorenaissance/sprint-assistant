export namespace T {
	export type Mode = "production" | "development"
	export interface Envs {
		mode: Mode
		botName: string
	}
}

export default {
	mode: <T.Mode>process.env.MODE,
	botName: process.env.BOT_NAME,
}
