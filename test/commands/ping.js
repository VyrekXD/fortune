const { InteractionCommand, InteractionContext } = require('../../dist/index.js')

module.exports = class extends InteractionCommand {
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
