import { CommandInteraction, Member } from '@biscuitland/core'
import { Fortune } from '../fortune'

export class InteractionContext {
	responded: boolean = false
	session: Fortune

	channelId?: string
	guildId?: string

	interactionCommand: CommandInteraction

	member?: Member

	constructor(session: Fortune, data: CommandInteraction) {
		this.session = session
		this.interactionCommand = data

		this.channelId = data.channelId
		this.guildId = data.guildId

		this.member = data.member
	}
}

