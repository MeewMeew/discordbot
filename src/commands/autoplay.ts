import type { CommandArgs } from "../types"
import { buildEmbeds } from "../utils"

export const name = "autoplay"
export const aliases = ["ap"]
export const description = "Toggle autoplay mode"
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
  await message.reply(buildEmbeds([
    {
      title: client.user?.globalName!,
      description: `Autoplay mode is now ${queue.toggleAutoplay() ? "on" : "off"}`,
      footer: {
        text: `Requested by ${message.author.globalName}`,
        iconURL: message.author.displayAvatarURL()
      }
    }
  ]))
}