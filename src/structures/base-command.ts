import { ApplicationCommandTypes } from '@biscuitland/api-types'

import { Locales } from '../constants.js'
import { CommandContext } from './index'

export interface CommandOptionChoice {
	name: string
	nameLocalizations?: Partial<Record<Locales, string>>

	value: string | number
}

export enum CommandOptionTypes {
	String = 3,
	Integer = 4,
	Boolean = 5,
	User = 6,
	Channel = 7,
	Role = 8,
	Mentionable = 9,
	Number = 10,
	Attachment = 11
}

export interface CommandOption {
	name: string
	nameLocalizations?: Partial<Record<Locales, string>>

	description: string
	descriptionLocalizations?: Partial<Record<Locales, string>>

	type: CommandOptionTypes

	minValue?: number
	maxValue?: number

	minLength?: number
	maxLength?: number

	choices?: CommandOptionChoice[]

	required?: boolean
}

export interface CommandData {
	name: string
	nameLocalizations?: Partial<Record<Locales, string>>

	description: string
	descriptionLocalizations?: Partial<Record<Locales, string>>

	type: ApplicationCommandTypes

	options?: CommandOption[]
}

export type CommandArgs = Record<string, any>

export interface BaseCommandData {
	name: string
	nameLocalizations?: Partial<Record<Locales, string>>

	description: string
	descriptionLocalizations?: Partial<Record<Locales, string>>

	guildIds: string[]

	options: CommandOption[]
}

export class BaseCommand {
	type = ApplicationCommandTypes.ChatInput

	name: string
	nameLocalizations?: Partial<Record<Locales, string>>

	description: string
	descriptionLocalizations?: Partial<Record<Locales, string>>

	guildIds: string[] = []

	options: CommandOption[] = []

	run?(context: CommandContext, args: CommandArgs): Promise<any> | any

	constructor(data?: BaseCommandData) {
		this.name = data?.name ?? this.name
		this.nameLocalizations = data?.nameLocalizations ?? this.nameLocalizations

		this.description = data?.description ?? this.description
		this.descriptionLocalizations = data?.descriptionLocalizations ?? this.descriptionLocalizations

		this.guildIds = data?.guildIds ?? this.guildIds
		this.options = data?.options ?? this.options
	}

	toJSON(): CommandData {
		return {
			name: this.name,
			nameLocalizations: this.nameLocalizations,

			description: this.description,
			descriptionLocalizations: this.descriptionLocalizations,

			type: this.type,

			options: this.options.length
				? this.options.map((x) => ({
						name: x.name,
						name_localizations: x.nameLocalizations,

						description: x.description,
						description_localizations: x.descriptionLocalizations,

						type: x.type,

						min_value: x.minValue,
						max_value: x.maxValue,

						min_length: x.minLength,
						max_length: x.maxLength,

						choices: x.choices?.map((y) => ({
							name: y.name,
							name_localizations: y.nameLocalizations,
							value: y.value
						})),

						required: x.required
				  }))
				: undefined
		}
	}
}
