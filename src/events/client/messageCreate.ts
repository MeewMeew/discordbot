import { type Message } from "discord.js"
import type { DisTubeClient } from "../../client"
import { Signale } from "signale"
import config from "../../../config.json"
import { buildEmbed } from "../../utils"

export const name = "messageCreate"
export const run = (client: DisTubeClient) => {
  const log = new Signale({ scope: "Message" })
  return async (message: Message) => {
    config.debug && log.debug(`Received message from ${message.author.tag}: ${message.content}`)
    if (message.author.bot) return
    if (!message.content.startsWith(config.prefix)) return
    let [commandName, ...args] = message.content.slice(config.prefix.length).trim().split(/ +/g)
    client.commands.forEach((command) => {
      if (command.aliases && command.aliases.includes(commandName)) commandName = command.name
    })
    const command = client.commands.get(commandName)
    if (!command || !command.run) return
    if (command.admin && config.ownerID !== message.author.id) {
      log.error(`The command ${commandName} is restricted to the bot owner`)
      return message.reply(buildEmbed({
        title: "Permission Denied",
        description: "You do not have permission to run this command",
        color: "Red"
      }))
    }
    try {
      await command.run({ message, args, client })
      log.success(`The command ${commandName} was successfully executed by ${message.author.tag}`)
    } catch (error: any) {
      message.reply(buildEmbed({
        title: "An Error Occurred",
        description: `An error occurred while running the command: ${error.stack || error}`,
        color: "Red"
      }))
      log.error(`An error occurred while running the command: ${error.stack || error}`)
    }
  }
}
