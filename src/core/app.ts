import { GatewayIntentBits } from 'discord.js'
import { App } from './client'

const client = new App({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ]
})

try {
  await client.login(client.config.token)
} catch (error) {
  const err = error as Error
  if ((err?.stack! || err?.message)?.includes('Not enough sessions remaining')) {
    process.send?.(err.message)
    process.exit(231)
  } else {
    client.log.fatal(err)
  }
}
