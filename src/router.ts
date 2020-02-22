import * as express from "express"
import { Request, Response } from "express"
import { Hangout } from "./types/index"
import Vote from "./vote"

namespace Post {
	const vote = new Vote()

	export async function handler(req: Request, res: Response) {
		const body: Hangout.Body = req.body
		const { type, message, space, user, action } = body

		if (space.type === "DM") {
			return res.json({
				text: `Sorry, ${user.displayName}, DM is not supported. Only room actions is implemented.`,
			})
		}

		if (type == "MESSAGE") {
			const response = vote.create("new Vote")
			return res.json(response)
		}

		if (type == "CARD_CLICKED") {
			// Update the card in place when the "UPVOTE" button is clicked.
			if (action.actionMethodName == "vote") {
				const count = parseInt(action.parameters[0].value)
				const response = vote.update(user.displayName, count + 1)
				return res.json(response)
			}
		}

		res.json()
	}
}

export default express.Router().post("/top-secret-bot", Post.handler)
