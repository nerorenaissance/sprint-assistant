import env from "./cli"
import { getWidgetValuePair, parseCommand, parseArgs } from "./commons"
import { Hangout } from "./types/index"
import * as Estimation from "./estimation"

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

	export interface EstimateArgs {
		poll: string
		desc?: string
	}

	export const commands = [
		[
			`Command: @${env.botName} ${T.Commands.Estimate}`,
			`Use -poll to set amount size of voting poll
			 Use -desc to set description of estimation`,
		],
		[`Command: @${env.botName} ${T.Commands.Standup}`, "Create daily standup meeting"],
		[`Command: @${env.botName} ${T.Commands.Help}`, "Command list"],
	]

	export const DEFAULT_MEETUP_LINK = process.env.DEFAULT_MEETUP_LINK
}

export function handleMessage(message: Hangout.Message) {
	const command = parseCommand(message?.text)
	switch (command) {
		case T.Commands.Help:
			return Message.help(message?.sender)
		case T.Commands.Estimate:
			return Message.estimate(message)
		case T.Commands.Standup:
			return Message.standup(message)
	}
}

export function handleCardClick(body: Hangout.Body) {
	const {
		action: { actionMethodName },
	} = body
	switch (actionMethodName) {
		case T.Actions.Vote:
			return Action.vote(body)
	}
}

export function handleAddToSpace(user: Hangout.User) {
	return Message.help(user)
}

namespace Action {
	export function vote(body: Hangout.Body) {
		const { action, user, message } = body
		if (!Estimation.default.estimation2Storys.has(message.name)) {
			Estimation.default.estimation2Storys.set(message.name, [])
		}

		const storys = Estimation.default.estimation2Storys.get(message.name)
		const alreadyVoted = storys.find(story => story.user === user.displayName)
		const value = action.parameters[0].value
		const poll = Number(action.parameters[1].value)
		const desc = action.parameters[2].value
		if (alreadyVoted && value != Estimation.T.Coffee && env.mode === "production") {
			alreadyVoted.value = value
		} else {
			storys.push({ user: user.displayName, value })
		}

		return Estimation.default.update(storys, poll, desc)
	}
}

namespace Message {
	export function help(user: Hangout.User) {
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
							widgets: getWidgetValuePair(T.commands),
						},
					],
				},
			],
		}
	}

	export function standup(message: Hangout.Message) {
		const user = message?.sender?.name
		const text = `<${user}> just started meetup! <users/all> ${T.DEFAULT_MEETUP_LINK}`
		return { text }
	}

	export function estimate(message: Hangout.Message) {
		const args = parseArgs<T.EstimateArgs>(message?.text)
		return Estimation.default.create(Number(args.poll), args.desc)
	}
}
