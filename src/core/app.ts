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

await client.login(client.config.token).catch(client.log.fatal)