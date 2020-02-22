import * as express from "express"
import { Request, Response } from "express"
import { Hangout } from "./types/index"
import Vote from "./vote"

namespace C {}

namespace T {
	export const DM_IS_NOT_IMPLEMENTED = "DM is not supported. Only room actions is implemented."
	export const NEW_POOL = "New pool started"
}

namespace Post {
	const vote = new Vote()

	export async function handler(req: Request, res: Response) {
		const body: Hangout.Body = req.body
		const { type, message, space, user, action } = body

		if (space.type === "DM") {
			return res.json({ text: T.DM_IS_NOT_IMPLEMENTED })
		}

		if (type == "MESSAGE") {
			const response = vote.create(T.NEW_POOL)
			return res.json(response)
		}

		if (type == "CARD_CLICKED") {
			if (action.actionMethodName == "vote") {
				const count = parseInt(action.parameters[0].value)
				const response = vote.update(`Last vote by: ${user.displayName}`, count + 1)
				return res.json(response)
			}
		}

		res.json()
	}
}

export default express.Router().post("/top-secret-bot", Post.handler)
