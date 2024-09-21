import { EmbedBuilder, type Message } from "discord.js"
import type { DisTubeClient } from "../../client"
import { Signale } from "signale"
import config from "../../../config.json"

export const name = "messageCreate"
export const run = (client: DisTubeClient) => {
  const log = new Signale({ scope: "Message Create" })
  return async (message: Message) => {
    if (message.author.bot) return
    if (!message.content.startsWith(config.prefix)) return
    const [commandName, ...args] = message.content.slice(config.prefix.length).trim().split(/ +/g)
    const command = client.commands.get(commandName)
    if (!command || !command.run) return
    if (command.admin && config.ownerID !== message.author.id) {
      log.error(`The command ${commandName} is restricted to the bot owner`)
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("Permission Denied")
            .setDescription("You do not have permission to run this command")
        ]
      })
    }
    try {
      await command.run({ message, args, client })
      log.success(`The command ${commandName} was successfully executed by ${message.author.tag}`)
    } catch (error: any) {
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("An Error Occurred")
            .setDescription(`An error occurred while running the command: ${error.stack || error}`)
        ]
      })
      log.error(`An error occurred while running the command: ${error.stack || error}`)
    }
  }
}
