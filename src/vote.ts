export namespace T {
	export interface Params {
		user: string
		value: string
	}

	export const Coffee = "☕"
}

export class Pool {
	private decks = [0, 0.5, 1, 2, 3, 5, 8, 13, "☕"]

	private counter = 0

	private generateDecks() {
		return this.decks.map(option => ({
			textButton: {
				text: option,
				onClick: {
					action: {
						actionMethodName: "vote",
						parameters: [
							{
								key: "option",
								value: option,
							},
						],
					},
				},
			},
		}))
	}

	private generateVotedUsersText(votes: T.Params[]) {
		return votes.map(vote => ({
			keyValue: {
				topLabel: vote.user,
				content: " ",
			},
		}))
	}

	private generateScore(votes: T.Params[]) {
		const wantingСoffee = votes.filter(vote => vote.value === T.Coffee)
		const points = votes.filter(vote => vote.value !== T.Coffee).map(vote => Number(vote.value))
		const summ = points.reduce((acc, point) => acc + point, 0)
		const average = Math.round(summ / points.length)
		const max = Math.max(...points)
		const min = Math.min(...points)

		const metrics = []

		if (points.length) {
			metrics.push(
				{
					keyValue: {
						topLabel: "Average",
						content: average,
					},
				},
				{
					keyValue: {
						topLabel: "Count",
						content: votes.length,
					},
				},
				{
					keyValue: {
						topLabel: "Max",
						content: max,
					},
				},
				{
					keyValue: {
						topLabel: "Min",
						content: min,
					},
				},
			)
		}

		if (wantingСoffee.length) {
			metrics.push({
				keyValue: {
					topLabel: "Break ☕",
					content: wantingСoffee.length,
				},
			})
		}

		return metrics
	}

	private generateSections(votes: T.Params[]) {
		const section = [
			{
				widgets: [{ buttons: this.generateDecks() }],
			},
		]

		if (votes?.length) {
			section.unshift({
				widgets: <any>this.generateScore(votes),
			})
		}

		if (votes?.length) {
			section.unshift({
				widgets: <any>this.generateVotedUsersText(votes),
			})
		}

		return section
	}

	private generateCards(votes?: T.Params[]) {
		return [
			{
				header: {
					title: `Estimation №${this.counter}`,
					subtitle: "🚀",
					imageUrl:
						"https://cdn3.iconfinder.com/data/icons/teamwork-and-organization/25/list_clipboard_planning-512.png",
					imageStyle: "IMAGE",
				},
				sections: this.generateSections(votes),
			},
		]
	}

	public create() {
		this.counter++
		return {
			actionResponse: { type: "NEW_MESSAGE" },
			cards: this.generateCards(),
		}
	}

	public update(votes: T.Params[]) {
		return {
			actionResponse: { type: "UPDATE_MESSAGE" },
			cards: this.generateCards(votes),
		}
	}
}
