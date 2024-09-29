import type { CommandArgs } from "../types"
import { buildEmbeds } from "../utils"

export const name = "resume"
export const description = "Resume the current song"
export const category = "Music"

export const run = async ({ message, client }: CommandArgs) => {
  const queue = client.distube.getQueue(message)
  if (!queue) return message.reply(buildEmbeds([
    {
      title: "Error",
      description: "There is no queue in this server!",
      color: "Red",
      footer: {
        text: `Requested by ${message.author.globalName}`,
        iconURL: message.author.displayAvatarURL()
      }
    }
  ]))
  await queue.resume()
  await message.reply(buildEmbeds([
    {
      title: client.user?.globalName!,
      description: "Resumed the current song!",
      footer: {
        text: `Requested by ${message.author.globalName}`,
        iconURL: message.author.displayAvatarURL()
      }
    }
  ]))
}