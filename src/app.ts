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
  client.log.complete(`Loaded ${client.commands.size} commands`)
  client.log.complete(`Loaded ${client.events.size} events`)
  client.log.complete(`Loaded ${client.distubeEvents.size} DisTube events`)
  client.on('ready', () => {
    client.log.star()
    client.log.star('------------------------------------' + '-'.repeat(config.prefix.length))
    client.log.info('Bot is ready with \' ' + config.prefix + ' \' as the prefix')
    client.log.info('Logged in as ' + client.user?.tag)
    client.log.star('------------------------------------' + '-'.repeat(config.prefix.length))
    client.log.star()
    setInterval(() => client.user?.setActivity({
      name: config.statuses[Math.floor(Math.random() * config.statuses.length)],
      type: 0
    }), 1e4)
  })
}

start().catch(client.log.fatal)