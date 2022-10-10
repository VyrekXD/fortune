import { DiscordChannel, DiscordRole, DiscordUser, CHANNEL, GUILD_ROLES, USER } from '@biscuitland/api-types'
import { ChannelFactory, Interaction, Role, User } from '@biscuitland/core'

import { CommandOptionTypes, Session, CommandContext } from './index.js'

export class Events {
	client: Session

	constructor(client: Session) {
		this.client = client

		client.events.on('interactionCreate', this.interactionCreate.bind(this))
	}

	async interactionCreate(interaction: Interaction) {
		if (!interaction.isCommand()) return

		const command = this.client.interactionCommands.find((x) => x.name === interaction.commandName)
		if (!command) return
		if (!command.run) return

		const options: Record<string, any> = {}
		if (interaction.options.hoistedOptions.length) {
			for (const option of interaction.options.hoistedOptions) {
				const optionData = command.options.find((x) => x.name === option.name)

				switch (optionData.type) {
					case CommandOptionTypes.Boolean:
					case CommandOptionTypes.Number:
					case CommandOptionTypes.Integer:
					case CommandOptionTypes.String: {
						options[option.name] = option.value
						break
					}

					case CommandOptionTypes.User: {
						options[option.name] = new User(
							this.client,
							await this.client.rest.get(USER(option.value as string))
						)
						break
					}

					case CommandOptionTypes.Channel: {
						const channel: DiscordChannel = await this.client.rest.get(CHANNEL(option.value as string))

						options[option.name] = channel.guild_id
							? ChannelFactory.fromGuildChannel(this.client, channel)
							: ChannelFactory.from(this.client, channel)
						break
					}

					case CommandOptionTypes.Role: {
						if (!interaction.guildId) break

						const roles: DiscordRole[] = await this.client.rest.get(GUILD_ROLES(interaction.guildId))
						const role = roles.find((x) => x.id === option.value)
						if (!role) continue

						options[option.name] = new Role(this.client, role, interaction.guildId)
						break
					}

					case CommandOptionTypes.Mentionable: {
						if (!interaction.guildId) break

						const user: DiscordUser = await this.client.rest.get(USER(option.value as string))

						if (user) {
							options[option.name] = new User(this.client, user)

							break
						} else {
							const roles: DiscordRole[] = await this.client.rest.get(GUILD_ROLES(interaction.guildId))
							const role = roles.find((x) => x.id === option.value)
							if (!role) continue

							options[option.name] = new Role(this.client, role, interaction.guildId)

							break
						}
					}
				}
			}
		}

		await command.run(new CommandContext(this.client, interaction), options)
	}
}
