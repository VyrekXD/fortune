import { PickOptions, Session } from '@biscuitland/core'
import { readdir } from 'fs/promises'
import { join } from 'path'
import { inspect } from 'util'
import { inCommonJs } from './constants'

import { InteractionCommand, InteractionContext } from './structures'

export class Fortune extends Session {
	interactionCommands: Set<InteractionCommand>

	constructor(options: PickOptions) {
		super(options)

		this.interactionCommands = new Set()
	}

	override async start() {
		this.events.on('interactionCreate', async (interaction) => {
			if (!interaction.isCommand()) return

			const Command = Array.from(this.interactionCommands.values()).find(
				(x) => x.name === interaction.commandName
			)
			if (!Command) return
			if (!Command.run) return

			const options: Record<string, any> = {}
			interaction.options.hoistedOptions.forEach((option) => {
				options[option.name] = option.value
			})

			await Command.run(new InteractionContext(this, interaction), options)
		})

		super.start()
	}

	async addInteractionCommandsIn(dir: string) {
		const files = await this._getFiles(dir)

		for (const file of files) {
			const imp = inCommonJs ? require(file) : (await new Function(`return import(file://${file})`)()).default
			if (!imp) continue

			const command: InteractionCommand = new imp()

			this.interactionCommands.add(command)
		}
	}

	private async _getFiles(dir: string): Promise<string[]> {
		const filesInFolder = await readdir(dir, { withFileTypes: true })
		const files = []

		for (const file of filesInFolder) {
			if (file.isDirectory()) {
				const subFiles = await this._getFiles(join(dir, file.name))
				for (const subFile of subFiles) files.push(subFile)
			} else files.push(join(dir, file.name))
		}

		return files
	}
}

