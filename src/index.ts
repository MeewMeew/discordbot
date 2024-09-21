import { GatewayIntentBits } from 'discord.js'
import { DisTubeClient } from './client'
import config from '../config.json'

const client = new DisTubeClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
})
async function start() {
  await client.login(config.token)
  client.on('ready', () => {
    client.log.success('Logged in as ' + client.user?.tag)
  })
}

start().catch(client.log.fatal)