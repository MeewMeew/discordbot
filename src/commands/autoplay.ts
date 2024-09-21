import { EmbedBuilder } from "discord.js"
import type { RunnerArgs } from "../types"

export const name = "autoplay"
export const description = "Toggle autoplay mode"
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
  const mode = queue.toggleAutoplay()
  message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(client.user?.globalName!)
        .setDescription(`Autoplay mode is now ${mode ? "on" : "off"}`)
    ]
  })
}