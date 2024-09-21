import { EmbedBuilder } from "discord.js"
import type { RunnerArgs } from "../types"

export const name = "pause"
export const description = "Pause the current song"
export const run = ({ message, client }: RunnerArgs) => {
  const queue = client.distube.getQueue(message)
  if (!queue) return message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Red")
        .setTitle("Error")
        .setDescription("There is no queue in this server!")
    ]
  })
  queue.pause()
  message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(client.user?.globalName!)
        .setDescription("Paused!")
    ]
  })
}