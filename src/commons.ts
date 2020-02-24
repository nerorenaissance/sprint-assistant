import env from "./cli"

export function cleanText(text) {
	return text
		.toLowerCase()
		.replace(`@${env.botName.toLowerCase()}`, "")
		.split(" ")
		.filter(char => char !== "")
		.join(" ")
}

export function getWidgetValuePair(commands) {
	return commands.map(command => ({
		keyValue: {
			topLabel: command[0],
			content: command[1],
		},
	}))
}
