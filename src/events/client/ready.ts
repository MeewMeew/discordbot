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
    client.log.info('Mewbot version v' + version + ' is online')
    client.log.info('Bot is ready with \' ' + client.config.prefix + ' \' as the prefix')
    client.log.info('Logged in as ' + client.user?.tag)
    client.log.star('------------------------------------' + '-'.repeat(client.config.prefix.length))
    setInterval(() => client.user?.setActivity({
      name: client.config.activities[Math.floor(Math.random() * client.config.activities.length)],
      type: ActivityType[client.config.activityType as keyof typeof ActivityType] || 0
    }), 1e4)
  }
}