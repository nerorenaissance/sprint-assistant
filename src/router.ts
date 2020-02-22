import * as express from "express"
import { Request, Response } from "express"
import { Hangout } from "./types/index"

function createMessage(voter, count, update) {
	return {
		actionResponse: { type: update ? "UPDATE_MESSAGE" : "NEW_MESSAGE" },
		cards: [
			{
				header: { title: `Last vote by ${voter}!` },
				sections: [
					{
						widgets: [
							{
								textParagraph: { text: `${count} votes!` },
							},
							{
								buttons: [
									{
										textButton: {
											text: "1",
											onClick: {
												action: {
													actionMethodName: "vote",
													parameters: [
														{
															key: "count",
															value: `${count}`,
														},
													],
												},
											},
										},
									},
									{
										textButton: {
											text: "2",
											onClick: {
												action: {
													actionMethodName: "vote",
													parameters: [
														{
															key: "count",
															value: `${count}`,
														},
													],
												},
											},
										},
									},
								],
							},
						],
					},
				],
			},
		],
	}
}

namespace Post {
	export async function handler(req: Request, res: Response) {
		const body: Hangout.Body = req.body
		const { type, message, space } = body

		console.log(type, "type \n")

		console.log(message, "message \n")

		console.log(space, "space \n")

		if (space.type !== "ROOM") {
			return res.json({ text: "Not supported" })
		}

		if (req.body.type == "ADDED_TO_SPACE" || req.body.type == "MESSAGE") {
			// Start a new vote when this bot is added or mentioned.
			return res.json(createMessage("nobody", 0, false))
		}

		if (req.body.type == "CARD_CLICKED") {
			// Update the card in place when the "UPVOTE" button is clicked.
			if (req.body.action.actionMethodName == "vote") {
				var count = parseInt(req.body.action.parameters[0].value)
				return res.json(createMessage(req.body.user.displayName, count + 1, true))
			}

			// Create a new vote when the "NEW VOTE" button is clicked.
			if (req.body.action.actionMethodName == "newvote") {
				return res.json(createMessage(req.body.user.displayName, 0, false))
			}
		}

		res.send(message)
	}
}

export default express.Router().post("/top-secret-bot", Post.handler)
