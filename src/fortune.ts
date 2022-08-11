import { PickOptions, Session } from '@biscuitland/core'
import { readdir } from 'fs/promises'
import { join } from 'path'

import { inCommonJs } from './constants'
import { EventsHandler } from './handlers'
import { BaseCommand, Category } from './structures'

export class Fortune extends Session {
	categoryCommands: Category[]
	interactionCommands: BaseCommand[]

	constructor(options: PickOptions) {
		super(options)

		this.categoryCommands = []
		this.interactionCommands = []

		new EventsHandler(this)
	}

	async loadCommandsIn(dir: string) {
		const files = await this._getFiles(dir)

		for (const file of files) {
			const imp = inCommonJs ? require(file) : (await new Function(`return import(\`file://${file}\`)`)()).default
			if (!imp) continue
			if (!imp.category) continue

			const module: Category = new imp()
			if (!module.importIn && !module.imported.length)
				throw new Error(`Category "${module.name}" must have either "in" or "import" property`)

			const commands: BaseCommand[] = module.importIn
				? module.imported
					? [...(await this.loadCategory(module.importIn)), ...module.imported]
					: await this.loadCategory(module.importIn)
				: module.imported

			module.imported.push(...commands)

			this.interactionCommands.push(...commands)
			this.categoryCommands.push(module)
		}
	}

	private async loadCategory(dir: string) {
		const files = await this._getFiles(dir)
		const imported: BaseCommand[] = []

		for (const file of files) {
			const imp = inCommonJs ? require(file) : (await new Function(`return import(\`file://${file}\`)`)()).default
			if (!imp) continue

			const cmd: BaseCommand = new imp()
			if (!(cmd instanceof BaseCommand))
				throw new Error(`A command in a category doesnt is an instance of BaseCommand`)

			imported.push(cmd)
		}

		return imported
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

