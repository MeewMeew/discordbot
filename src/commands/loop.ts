import { EmbedBuilder } from "discord.js"
import type { RunnerArgs } from "../types"

export const name = "loop"
export const description = "Toggle loop mode"
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
  const mode = queue.setRepeatMode(queue.repeatMode === 0 ? 1 : 0)
  message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(client.user?.globalName!)
        .setDescription(`Loop mode is now ${mode ? "on" : "off"}`)
    ]
  })
}