import env from "./cli"
import { getWidgetValuePair, cleanText } from "./commons"
import { Hangout } from "./types/index"
import * as Poker from "./estimation"

export namespace T {
	export enum Commands {
		Estimate = "estimate",
		Help = "help",
		Standup = "standup",
	}

	export enum Actions {
		Vote = "vote",
		Timer = "timer",
	}
}

const poker = new Poker.Estimation()

export const commands = [
	["Create Planning poker poll with 1, 2, 3, 5, 8 deck", `@${env.botName} ${T.Commands.Estimate}`],
	["Create schedule for daily standup meeting (DISABLED)", `@${env.botName} ${T.Commands.Standup}`],
	["Command list", `@${env.botName} ${T.Commands.Help}`],
]

export function handleMessage(message: Hangout.Message) {
	switch (cleanText(message?.text)) {
		case T.Commands.Help:
			return getHelp(message?.sender)
		case T.Commands.Estimate:
			return poker.createPlanning()
	}
}

export function handleCardClick(body: Hangout.Body) {
	const { action, user, message } = body
	switch (action?.actionMethodName) {
		case T.Actions.Vote:
			if (!poker.estimation2Storys.has(message.name)) {
				poker.estimation2Storys.set(message.name, [])
			}

			const storys = poker.estimation2Storys.get(message.name)
			const alreadyVoted = storys.find(story => story.user === user.displayName)
			const value = action.parameters[0].value
			if (alreadyVoted && value != Poker.T.Coffee && env.mode === "production") {
				alreadyVoted.value = value
			} else {
				storys.push({ user: user.displayName, value })
			}
			return poker.updatePlanning(storys)
	}
}

export function handleAddToSpace(user: Hangout.User) {
	return getHelp(user)
}

function getHelp(user: Hangout.User) {
	return {
		cards: [
			{
				header: {
					title: `Need help ${user.displayName}?`,
					imageUrl: "https://en.touhouwiki.net/images/a/a8/Th06Remilia.png",
					imageStyle: "IMAGE",
				},
				sections: [
					{
						widgets: getWidgetValuePair(commands),
					},
				],
			},
		],
	}
}
