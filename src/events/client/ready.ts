import { ActivityType, Events } from "discord.js";
import type { App } from "../../core/client";
import { version } from '../../../package.json'

export const name = Events.ClientReady
export const run = (client: App) => {
  return function () {
    client.log.star('------------------------------------' + '-'.repeat(client.config.prefix.length))
    client.log.success(`Loaded ${client.commands.size} Bot commands`)
    client.log.success(`Loaded ${client.events.size} Discord events`)
    client.log.success(`Loaded ${client.distubeEvents.size} DisTube events`)
    client.log.star('------------------------------------' + '-'.repeat(client.config.prefix.length))
    client.log.info('Mewbot version v' + version)
    client.log.info('Bot is ready with \' ' + client.config.prefix + ' \' as the prefix')
    client.log.info('Logged in as ' + client.user?.tag)
    client.log.star('------------------------------------' + '-'.repeat(client.config.prefix.length))
    setInterval(() => {
      let activity = client.config.activities[Math.floor(Math.random() * client.config.activities.length)]
      let type = ActivityType[client.config.activityType as keyof typeof ActivityType] || 0
      client.debug && client.log.debug(`Activity set to: ${client.config.activityType} ${activity}`)
      client.user?.setActivity({
        name: activity,
        type: type
      })
    }, 1e4)
    setTimeout(() => {
      client.log.info('Restarting...')
      process.exit(0)
    }, client.config.rebootTimeout)
  }
}