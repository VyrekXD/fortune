const { config } = require('dotenv')
const { join } = require('path')
const { Fortune } = require('../dist/index')

config()

const bot = new Fortune({ token: process.env.TOKEN })

bot.events.on('ready', () => {
	console.log('Ready!')
})

async function main() {
	await bot.loadCommandsIn(join(__dirname, 'commands'))

	await bot.start()
	console.log('Started')
}

main()
