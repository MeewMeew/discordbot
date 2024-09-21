import { EmbedBuilder } from "discord.js"
import type { RunnerArgs } from "../types"

export const name = "seek"
export const description = "Seek to a specific timestamp in the song"
export const usage = "<timestamp>"
export const run = async ({ message, args, client }: RunnerArgs) => {
  const time = parseInt(args[0]) || 0
  const queue = client.distube.getQueue(message)
  if (!queue) return
  if (isNaN(time)) return message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Red")
        .setTitle("Error")
        .setDescription("Invalid timestamp!")
    ]
  })
  queue.seek(time)
  await message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(client.user?.globalName!)
        .setDescription(`Seeked to \`${queue.formattedCurrentTime}\``)
    ]
  })
}