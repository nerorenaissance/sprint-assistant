import env from "./cli"

export function cleanText(text: string) {
	return text
		.toLowerCase()
		.replace(`@${env.botName.toLowerCase()}`, "")
		.split(" ")
		.filter(char => char !== "")
		.join(" ")
}

export function getWidgetValuePair(commands: string[][]) {
	return commands.map(command => ({
		keyValue: {
			topLabel: command[0],
			content: command[1],
		},
	}))
}
