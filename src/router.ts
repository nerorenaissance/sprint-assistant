import * as express from "express"
import { Request, Response } from "express"
import { Hangout } from "./types/index"
import * as Poker from "./estimation"

const poker = new Poker.Estimation()
const messageVotes = new Map<string, Poker.T.Params[]>()

namespace T {
	export enum Text {
		ADDED_TO_SPACE = "```Use @mention to interact with BOT. \n For more info — use !help```",
		DM = "DM is not supported. Only room actions is implemented at this moment.",
		HELP = "```*!estimate* is a command to create planning poker with 0, 0.5, 1, 2, 3, 5, 8, 13, ☕ decks\n*!standup* is a command to set a daily standup meeting (DISABLED)```",
	}

	export enum Commands {
		Estimate = "!estimate",
		Help = "!help",
		Standup = "!standup",
		Debug = "!debug",
	}

	export enum Actions {
		Vote = "vote",
		Timer = "timer",
	}
}

namespace C {
	export const Reducer = () => {}
}

namespace Post {
	export async function handler(req: Request, res: Response) {
		const body: Hangout.Body = req.body
		const { type, message, space, user, action } = body

		if (space.type == "DM") {
			return res.json({ text: T.Text.DM })
		}

		if (type == "ADDED_TO_SPACE") {
			return res.json({ text: T.Text.ADDED_TO_SPACE })
		}

		if (message?.text?.includes(T.Commands.Estimate)) {
			return res.json(poker.createPlanning())
		}

		if (message?.text?.includes(T.Commands.Help)) {
			return res.json({ text: T.Text.HELP })
		}

		if (action?.actionMethodName == T.Actions.Vote) {
			if (!messageVotes.has(message.name)) {
				messageVotes.set(message.name, [])
			}

			const storys = messageVotes.get(message.name)
			const alreadyVoted = storys.find(story => story.user === user.displayName)
			const value = action.parameters[0].value
			if (alreadyVoted && value != Poker.T.Coffee && !process.env.DEBUG) {
				alreadyVoted.value = value
			} else {
				storys.push({ user: user.displayName, value })
			}

			const response = poker.updatePlanning(storys)
			return res.json(response)
		}
	}
}

export default express.Router().post(`/${process.env.BOT_URL}`, Post.handler)
