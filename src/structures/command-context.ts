import { InteractionResponseTypes } from '@biscuitland/api-types'
import { CommandInteraction, InteractionApplicationCommandCallbackData, Member, Message, User } from '@biscuitland/core'

import { Session } from './index.js'

export class CommandContext {
	channelId?: string
	guildId?: string

	member?: Member
	user?: User

	interaction: CommandInteraction
	client: Session

	constructor(client: Session, interaction: CommandInteraction) {
		this.interaction = interaction
		this.client = client

		this.channelId = interaction.channelId
		this.guildId = interaction.guildId

		this.member = interaction.member
		this.user = interaction.user
	}

	async deferThink() {
		await this.interaction.respond({ type: InteractionResponseTypes.DeferredChannelMessageWithSource })
	}

	async defer() {
		await this.interaction.defer()
	}

	editOrRespond(data: InteractionApplicationCommandCallbackData): Promise<undefined | Message> {
		if (this.interaction.responded) return this.interaction.editReply(data)
		return this.interaction.respond({ with: data })
	}

	get createdTimestamp(): number {
		return this.interaction.createdTimestamp
	}

	get createdAt(): Date {
		return new Date(this.createdTimestamp)
	}
}
