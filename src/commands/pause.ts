import type { RunnerArgs } from "../types"
import { buildEmbed } from "../utils"

export const name = "pause"
export const description = "Pause the current song"
export const category = "Music"

export const run = ({ message, client }: RunnerArgs) => {
  const queue = client.distube.getQueue(message)
  if (!queue) return message.reply(buildEmbed({
    title: "Error",
    description: "There is no queue in this server!",
    color: "Red",
    footer: {
      text: `Requested by ${message.author.globalName}`,
      iconURL: message.author.displayAvatarURL()
    }
  }))
  queue.pause()
  message.reply(buildEmbed({
    title: client.user?.globalName!,
    description: "Paused the current song!",
    footer: {
      text: `Requested by ${message.author.globalName}`,
      iconURL: message.author.displayAvatarURL()
    }
  }))
}