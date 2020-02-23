import * as express from "express"
import { Request, Response } from "express"
import { Hangout } from "./types/index"
import * as Vote from "./vote"

const vote = new Vote.Pool()
const msg2Votes = new Map<string, Vote.T.Params[]>()

namespace T {
	export enum Text {
		ADDED_TO_SPACE = `Use @mention to interact with BOT. \n For more info — use !help`,
		DM = "DM is not supported. Only room actions is implemented at this moment.",
		HELP = `*!estimate* is a command to create planning poker with 0, 0.5, 1, 2, 3, 5, 8, 13, ☕ decks\n*!standup* is a command to set a daily standup meeting (DISABLED)`,
	}

	export enum Commands {
		Estimate = "!estimate",
		Help = "!help",
		Standup = "!standup",
	}

	export enum Actions {
		Vote = "vote",
		Timer = "timer",
	}
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
			return res.json(vote.create())
		}

		if (message?.text?.includes(T.Commands.Help)) {
			return res.json({ text: T.Text.HELP })
		}

		if (action?.actionMethodName == T.Actions.Vote) {
			if (!msg2Votes.has(message.name)) {
				msg2Votes.set(message.name, [])
			}
			const votes = msg2Votes.get(message.name)
			votes.push({ user: user.displayName, value: action.parameters[0].value })
			const response = vote.update(votes)
			return res.json(response)
		}
	}
}

export default express.Router().post("/top-secret-bot", Post.handler)
