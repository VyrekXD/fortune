import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from '@biscuitland/api-types'

import { InteractionContext } from './interaction-context'

type CommandArgs = Record<string, any>

interface InteractionCommandOptions {
	name: string
	description: string
	type: ApplicationCommandOptionTypes
}

interface InteractionCommandData {
	name: string
	description: string
	options?: InteractionCommandOptions[]
}

export class InteractionCommand {
	type: ApplicationCommandTypes = ApplicationCommandTypes.ChatInput

	name: string = ''
	description: string = ''

	run?(context: InteractionContext, args: CommandArgs): Promise<any> | any

	constructor(data: InteractionCommandData) {
		this.name = this.name ?? data.name
		this.description = this.description ?? data.description
	}
}

