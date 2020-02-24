import env from "./cli"
const { google } = require("googleapis")

export namespace T {
	export interface Params {
		user: string
		value: string
	}

	export const Coffee = "☕"
}

export class Estimation {
	private deck = [0, 0.5, 1, 2, 3, 5, 8, 13, "☕"]

	private counter = 0

	private maxGap = 3

	public estimation2Storys = new Map<string, T.Params[]>()

	private createDeck() {
		return this.deck.map(option => ({
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

	private createUsers(storys: T.Params[]) {
		return storys
			.filter(story => story.value != T.Coffee)
			.map(story => ({
				keyValue: {
					topLabel: story.user,
					content: " ",
				},
			}))
	}

	private teamHasDisagreement(min: number, max: number, points: number[]) {
		const minIndex = this.deck.findIndex(story => story === min)
		const maxIndex = this.deck.findIndex(story => story === max)
		const gap = this.deck.slice(minIndex, maxIndex)
		return gap.length > this.maxGap
	}

	private createEstimationFields(storys: T.Params[]) {
		const wantingСoffee = new Set(
			storys.filter(story => story.value === T.Coffee).map(story => story.user),
		)

		const points = storys
			.filter(story => story.value !== T.Coffee)
			.map(story => Number(story.value))

		const summ = points.reduce((acc, point) => acc + point, 0)
		const average = Math.round(summ / points.length)
		const max = Math.max(...points)
		const min = Math.min(...points)

		const fields = []
		if (points.length) {
			fields.push(
				{
					keyValue: {
						topLabel: "Average",
						content: average,
					},
				},
				{
					keyValue: {
						topLabel: "Count",
						content: points.length,
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

		if (this.teamHasDisagreement(min, max, points)) {
			const minIssuer = storys.find(story => Number(story.value) === min)
			const maxIssuer = storys.find(story => Number(story.value) === max)
			fields.push({
				keyValue: {
					topLabel: "⚠️ Estimation disagreement",
					contentMultiline: true,
					content: `team have to make a compromise`,
					bottomLabel: `${minIssuer.user}(${minIssuer.value}) 🤼‍♂️ ${maxIssuer.user}(${maxIssuer.value})`,
				},
			})
		}

		if (wantingСoffee.size) {
			fields.push({
				keyValue: {
					topLabel: "Break ☕",
					content: wantingСoffee.size,
				},
			})
		}

		return fields
	}

	private createTimerField(counter: number) {
		return [
			{
				keyValue: {
					topLabel: "Timer",
					content: counter,
				},
			},
		]
	}

	private createSection(storys: T.Params[]) {
		const section = [
			{
				widgets: [{ buttons: this.createDeck() }],
			},
		]

		if (storys?.length) {
			section.unshift({
				widgets: <any>this.createEstimationFields(storys),
			})
			section.unshift({
				widgets: <any>this.createUsers(storys),
			})
		}

		return section
	}

	private createEstimation(storys?: T.Params[]) {
		return [
			{
				header: {
					title: `Estimation №${this.counter} ${env.mode === "production" ? "" : "DEBUG MODE"}`,
					subtitle: "🚀",
					imageUrl:
						"https://cdn3.iconfinder.com/data/icons/teamwork-and-organization/25/list_clipboard_planning-512.png",
					imageStyle: "IMAGE",
				},
				sections: this.createSection(storys),
			},
		]
	}

	public createPlanning() {
		this.counter++
		return {
			actionResponse: { type: "NEW_MESSAGE" },
			cards: this.createEstimation(),
		}
	}

	public updatePlanning(storys: T.Params[]) {
		return {
			actionResponse: { type: "UPDATE_MESSAGE" },
			cards: this.createEstimation(storys),
		}
	}
}
