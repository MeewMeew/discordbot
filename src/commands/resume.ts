import type { RunnerArgs } from "../types"
import { buildEmbed } from "../utils"

export const name = "resume"
export const description = "Resume the current song"
export const category = "Music"

export const run = async ({ message, client }: RunnerArgs) => {
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
  await queue.resume()
  await message.reply(buildEmbed({
    title: client.user?.globalName!,
    description: "Resumed the current song!",
    footer: {
      text: `Requested by ${message.author.globalName}`,
      iconURL: message.author.displayAvatarURL()
    }
  }))
}