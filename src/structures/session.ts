import * as biscuit from '@biscuitland/core'
import { readdir } from 'fs/promises'
import { join } from 'path'

import { BaseCommand } from './index.js'
import { Events } from './events.js'

export class Session extends biscuit.Session {
	interactionCommands: BaseCommand[] = []

	constructor(options: biscuit.PickOptions) {
		super(options)

		new Events(this)
	}

	override async start() {
		await super.start()

		const guildCommands = this.interactionCommands.filter((x) => x.guildIds.length)
		const globalCommands = this.interactionCommands.filter((x) => !x.guildIds.length)
		if (guildCommands.length) {
			const guildCommandsArray = guildCommands.reduce((acc, cur) => {
				const guildId = cur.guildIds[0]
				if (!acc[guildId]) acc[guildId] = []

				acc[guildId].push(cur.toJSON())

				return acc
			}, {} as Record<string, any[]>)

			for (const guildId in guildCommandsArray) {
				await this.upsertApplicationCommands(guildCommandsArray[guildId], guildId)
			}
		}

		if (globalCommands.length) {
			await this.upsertApplicationCommands(
				globalCommands.map((x) => x.toJSON()) as biscuit.UpsertDataApplicationCommands[]
			)
		}
	}

	async loadCommands(path: string) {
		const files = await this._getFiles(path)

		for (const file of files) {
			const imported = await import(`file://${file}`)
			if (!imported) continue
			if (!imported.default) continue

			const command: BaseCommand = new imported.default()

			this.interactionCommands.push(command)
		}
	}

	async loadEvents(path: string) {
		const files = await this._getFiles(path)
		let i = 0

		for (const file of files) {
			const imported = await import(`file://${file}`)
			if (!imported) continue
			if (!imported.run) continue
			if (!imported.name) continue

			this.events.on(imported.name, imported.run.bind(null, this))
			i++
		}

		return i
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
