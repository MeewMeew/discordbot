import type { CommandArgs } from "../types"
import { buildEmbed } from "../utils"

export const name = "loop"
export const aliases = ["repeat"]
export const description = "Toggle loop mode"
export const category = "Music"

export const run = ({ message, client }: CommandArgs) => {
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
  const mode = queue.setRepeatMode(queue.repeatMode === 0 ? 1 : 0)
  message.reply(buildEmbed({
    title: client.user?.globalName!,
    description: `Loop mode is now ${mode ? "on" : "off"}`,
    footer: {
      text: `Requested by ${message.author.globalName}`,
      iconURL: message.author.displayAvatarURL()
    }
  }))
}