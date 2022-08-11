import { Interaction } from '@biscuitland/core'
import { Fortune } from '../fortune'
import { InteractionContext } from '../structures'

export class EventsHandler {
	fortune: Fortune

	constructor(fortune: Fortune) {
		this.fortune = fortune

		this.fortune.events.on('interactionCreate', this.interactionCreate.bind(this))
	}

	async interactionCreate(interaction: Interaction) {
		if (!interaction.isCommand()) return

		const command = this.fortune.interactionCommands.find((x) => x.name === interaction.commandName)
		if (!command) return
		if (!command.run) return

		const options: Record<string, any> = {}
		if (interaction.options.hoistedOptions.length) {
			interaction.options.hoistedOptions.forEach((x) => {
				options[x.name] = x.value
			})
		}

		await command.run(new InteractionContext(this.fortune, interaction), options)
	}
}
