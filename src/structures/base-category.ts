import { BaseCommand } from '../structures'

export interface CategoryOptions {
	name?: string
	import?: BaseCommand[]
	importIn?: string
}

export class Category {
	name: string | null = null
	imported: BaseCommand[] = []

	importIn?: string

	static category: boolean = true

	constructor(options?: CategoryOptions) {
		if (!options) return this

		this.name = options.name ?? null

		this.importIn = options.importIn

		this.imported = options.import ?? []
	}
}
