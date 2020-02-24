import * as express from "express"
import { Request, Response } from "express"
import { Hangout } from "./types/index"
import env from "./cli"
import { handleAddToSpace, handleMessage, handleCardClick } from "./bot"

namespace Bot {
	export async function handler(req: Request, res: Response) {
		const body: Hangout.Body = req.body
		const { type, message, space, user } = body

		if (space.type == "DM") {
			return res.json({
				text: `DM is not supported at this moment. Add bot to group to interfact.`,
			})
		}

		switch (type) {
			case "ADDED_TO_SPACE":
				return res.json(handleAddToSpace(user))
			case "MESSAGE":
				return res.json(handleMessage(message))
			case "CARD_CLICKED":
				return res.json(handleCardClick(body))
		}
	}
}

export default express.Router().post(`/${env.botURL}`, Bot.handler)
