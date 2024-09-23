import type { CommandArgs } from "../types"
import { buildEmbed } from "../utils"

export const name = "skip"
export const description = "Skip the current song"
export const usage = ""
export const category = "Music"

export const run = async ({ message, client }: CommandArgs) => {
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
  await queue.skip()
  await message.reply(buildEmbed({
    title: client.user?.globalName!,
    description: "Skipped!",
    footer: {
      text: `Requested by ${message.author.globalName}`,
      iconURL: message.author.displayAvatarURL()
    }
  }))
}