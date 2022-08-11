const { BaseCommand, InteractionContext } = require('../../../dist')

module.exports = class extends BaseCommand {
	name = 'ping'
	description = 'Pong!'

	/**
	 * @param {InteractionContext} ctx
	 */
	async run(ctx) {
		ctx.interactionCommand.respondWith({
			content: 'Pong!'
		})
	}
}
