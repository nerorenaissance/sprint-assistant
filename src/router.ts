import * as express from "express"
import { Request, Response } from "express"
import { Hangout } from "./types/index"
import * as Vote from "./vote"

namespace C {}

namespace T {
	export const DM_IS_NOT_IMPLEMENTED = "DM is not supported. Only room actions is implemented."
	export const NEW_POOL = "New pool started"
	export const ADDED_TO_SPACE = `@all to get command list use !help with @me`
	export const HELP = `to start new pool use !estimate`
	export enum Commands {
		Estimate = "!estimate",
		Help = "!help",
	}
}

namespace Post {
	const vote = new Vote.Pool()
	const msg2Votes = new Map<string, Vote.T.Params[]>()

	export async function handler(req: Request, res: Response) {
		const body: Hangout.Body = req.body
		const { type, message, space, user, action } = body

		if (space.type == "DM") {
			return res.json({ text: T.DM_IS_NOT_IMPLEMENTED })
		}

		if (type == "ADDED_TO_SPACE") {
			return res.json({ text: T.ADDED_TO_SPACE })
		}

		if (type == "MESSAGE") {
			if (message.text.includes(T.Commands.Estimate)) {
				const response = vote.create()
				return res.json(response)
			}

			return res.json({ text: T.HELP })
		}

		if (type == "CARD_CLICKED") {
			const { actionMethodName } = action
			if (actionMethodName == "vote") {
				const value = action.parameters[0].value
				const params = { user: user.displayName, value: value }

				if (!msg2Votes.has(message.name)) {
					msg2Votes.set(message.name, [])
				}

				const votes = msg2Votes.get(message.name)
				votes.push(params)
				const response = vote.update(votes)
				return res.json(response)
			}
		}
	}
}

export default express.Router().post("/top-secret-bot", Post.handler)
