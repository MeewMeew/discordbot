import type { RunnerArgs } from "../types"
import { buildEmbed } from "../utils"

export const name = "seek"
export const aliases = ["sk"]
export const description = "Seek to a specific timestamp in the song"
export const usage = "<timestamp>"
export const category = "Music"

export const run = async ({ message, args, client }: RunnerArgs) => {
  const time = parseInt(args[0]) || 0
  const queue = client.distube.getQueue(message)
  if (!queue) return
  if (isNaN(time)) return message.reply(buildEmbed({
    title: "Error",
    description: "Invalid timestamp!",
    color: "Red",
    footer: {
      text: `Requested by ${message.author.globalName}`,
      iconURL: message.author.displayAvatarURL()
    }
  }))
  await queue.seek(time)
  await message.reply(buildEmbed({
    title: client.user?.globalName!,
    description: `Seeked to \`${queue.formattedCurrentTime}\``,
    footer: {
      text: `Requested by ${message.author.globalName}`,
      iconURL: message.author.displayAvatarURL()
    }
  }))
}