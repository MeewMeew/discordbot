import { type Message, Events } from "discord.js"
import type { DisTubeClient } from "../../core/client"
import { Signale } from "signale"
import { buildEmbed, matchMedia } from "../../utils"
import type { Command } from "../../types"

export const name = Events.MessageCreate
export const run = (client: DisTubeClient) => {
  const log = new Signale({ scope: "message" })
  return async (message: Message) => {
    client.config.debug && log.debug(`Received message from ${message.author.tag}: ${message.content}`)
    if (message.author.bot || !message.guild) return
    if (!message.content.startsWith(client.config.prefix) && !matchMedia(message.content)) return
    let command: Command | null = null
    let args: string[] = []
    if (matchMedia(message.content)) {
      command = client.commands.get("autodownload")!
      args = [message.content]
    } else {
      let [commandName, ..._args] = message.content.slice(client.config.prefix.length).trim().split(/ +/g)
      client.commands.forEach((command) => {
        if (command.aliases && command.aliases.includes(commandName)) commandName = command.name
      })
      command = client.commands.get(commandName)!
      args = _args
    }
    if (!command || !command.run) return
    if (command.admin && client.config.ownerID !== message.author.id) {
      log.error(`The command ${command.name} is restricted to the bot owner`)
      return message.reply(buildEmbed({
        title: "Permission Denied",
        description: "You do not have permission to run this command",
        color: "Red"
      }))
    }
    try {
      await command.run({ message, args, client })
      log.success(`The command ${command.name} was successfully executed by ${message.author.tag}`)
    } catch (error: any) {
      client.config.debug && await message.reply(buildEmbed({
        title: "An Error Occurred",
        description: `An error occurred while running the command: ${error.stack || error}`,
        color: "Red"
      }))
      log.error(`An error occurred while running the command: ${error.stack || error}`)
    }
  }
}
