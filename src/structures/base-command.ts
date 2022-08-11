import { ApplicationCommandTypes } from '@biscuitland/api-types'

import { InteractionContext } from './interaction-context'

export type CommandArgs = Record<string, any>

export interface BaseCommandOptions {
	name: string
	description: string

	// subCommands: BaseCommand[]
}

export class BaseCommand {
	type = ApplicationCommandTypes.ChatInput

	name: string = ''
	description: string = ''

	run?(context: InteractionContext, args: CommandArgs): Promise<any> | any

	constructor(data: BaseCommandOptions) {
		if (!this.type) throw new Error('Command type is required')

		if (!data) return this
		if (!data.name) throw new Error('Command name is required')

		this.name = data.name
		this.description = data.description
	}
}

