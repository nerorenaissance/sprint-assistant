export namespace T {
	export type Mode = "production" | "development"
	export interface Envs {
		mode: Mode
		botName: string
	}
}

export default {
	mode: <T.Mode>process.env.MODE || "development",
	botName: process.env.BOT_NAME,
	botURL: process.env.BOT_URL,
	Port: process.env.PORT || 3500,
}
