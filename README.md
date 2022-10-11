# @fortuneland/core

## A library that wraps biscuit in a more dev-friendly enviroment without taking to much performance

## Install (for [node18](https://nodejs.org/en/download/))

```sh-session
npm install @fortuneland/core
yarn add @fortuneland/core
pnpm add @fortuneland/core
```

## In a nutshell, what is fortune?

-   A bleeding edge framework
-   A wrapper of a fast library (biscuit) to interface the Discord API

Fortune is obviously inspired by biscuit but in all ways, devs of biscuit "Believe
that you should not make software that does things it is not supposed to do.", fortune thinks devs
can use fast and easy-to-use libraries to make their own bots.

_Happy coding with fortune :D_

## Why fortune (and not biscuit)

-   Fortune is just more dev-friendly, great for experienced and new devs
-   Fortune is scalable as biscuit
-   Fortune doesnt affect performance a lot compared to using only biscuit
-   Biscuit is a great library but its just non-feature rich (They made it that way, to became "minimal"), fortune fixes that issue

## Example

**Docs coming soon**

Your files need to be something like this

```
/ fortune-bot
	/ src
		/ commands
			- ping.ts
		/ events
			- ready.ts
		- index.ts

```

```ts
// index.ts
import { Session } from '@fortuneland/core'
import { GatewayIntents } from '@biscuitland/api-types'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const session = new Session({ token: 'your token', intents: GatewayIntents.Guilds })

function main() {
	await session.loadCommands(join(__dirname, '.', 'commands'))
	await session.loadEvents(join(__dirname, '.', 'events'))
	await session.start()
}

main()

// ping.ts
import { BaseCommand, CommandContext } from '@fortuneland/core'

export default class extends BaseCommand {
	name = 'ping'
	description = 'Pong!'

	run(ctx: CommandContext) {
		ctx.editOrRespond({ content: 'Pong!' })
	}
}

// ready.ts
export const run = () => {
	console.log('Bot is ready!')
}

export const name = 'ready'
```

## Links

-   [Biscuit](https://biscuitjs.com/)
-   [Discord](https://discord.gg/XNw2RZFzaP)
-   [Biscuit Docs](https://docs.biscuitjs.com/)

## Known issues:

(Fortune has the same issues as biscuit, because fortune uses biscuit)
