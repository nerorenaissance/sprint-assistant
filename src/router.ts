import * as express from "express"
import { Request, Response } from "express"
import { Hangout } from "./types/index"
import env from "./cli"
import { handleAddToSpace, handleMessage, handleCardClick } from "./bot"

namespace T {
	export enum EventTypes {
		ADDED_TO_SPACE = "ADDED_TO_SPACE",
		MESSAGE = "MESSAGE",
		CARD_CLICK = "CARD_CLICKED",
	}

	export enum TextResponces {
		DM = "DM is not supported at this moment. Add bot to group to interfact.",
	}
}

namespace Bot {
	export async function handler(req: Request, res: Response) {
		const body: Hangout.Body = req.body
		const { type, message, space, user } = body
		if (space.type == "DM") {
			return res.json({ text: T.TextResponces.DM })
		}

		switch (type) {
			case T.EventTypes.ADDED_TO_SPACE:
				return res.json(handleAddToSpace(user))
			case T.EventTypes.MESSAGE:
				return res.json(handleMessage(message))
			case T.EventTypes.CARD_CLICK:
				return res.json(handleCardClick(body))
		}
	}
}

export default express.Router().post(`/${env.botURL}`, Bot.handler)
