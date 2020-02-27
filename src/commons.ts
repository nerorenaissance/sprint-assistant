import env from "./cli"

export function parseCommand(text: string) {
	return text
		.toLowerCase()
		.replace(`@${env.botName.toLowerCase()}`, "")
		.split(" ")
		.filter(char => char !== "")[0]
}

export function parseArgs<T>(text: string): T {
	const chars = text.split("-").slice(1)
	const args = {}
	for (const char of chars) {
		const arg = char.split(" ")
		args[arg[0]] = arg[1]
	}

	return <T>args
}

export function getWidgetValuePair(commands: string[][]) {
	return commands.map(command => ({
		keyValue: {
			topLabel: command[0],
			content: command[1],
		},
	}))
}
