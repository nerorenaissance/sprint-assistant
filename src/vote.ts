export default class Vote {
	private fibonacciNumbers = [1, 2, 3, 5, 8, 13]

	private generateButtons(count: number) {
		return this.fibonacciNumbers.map(option => ({
			textButton: {
				text: option,
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
		}))
	}

	private generateSections(count: number) {
		return [
			{
				widgets: [
					{ textParagraph: { text: `${count} votes!` } },
					{ buttons: this.generateButtons(count) },
				],
			},
		]
	}

	private generateCards(title: string, count: number) {
		return [
			{
				header: { title },
				sections: this.generateSections(count),
			},
		]
	}

	public create(title: string, count = 0) {
		return {
			actionResponse: { type: "NEW_MESSAGE" },
			cards: this.generateCards(title, count),
		}
	}

	public update(title: string, count: number) {
		return {
			actionResponse: { type: "UPDATE_MESSAGE" },
			cards: this.generateCards(title, count),
		}
	}
}
