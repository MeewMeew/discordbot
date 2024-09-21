import type { Message } from "discord.js"
import type { DisTubeClient } from "../../client"
import { Signale } from "signale"
import config from "../../../config.json"

export const name = "messageCreate"
export const run = (client: DisTubeClient) => {
  const log = new Signale({ scope: "Message Create", interactive: true })
  return async (message: Message) => {
    if (message.author.bot) return
    if (!message.content.startsWith(config.prefix)) return
    const [commandName, ...args] = message.content.slice(config.prefix.length).trim().split(/ +/g)
    const command = client.commands.get(commandName)
    if (!command || !command.run) return
    log.await(`The command ${commandName} is being executed by ${message.author.tag}`)
    try {
      await command.run({ message, args, client })
      log.success(`The command ${commandName} was successfully executed by ${message.author.tag}`)
    } catch (error: any) {
      message.reply({
        content: `An error occurred while running the command: ${error.stack || error}`
      })
      log.error(`An error occurred while running the command: ${error.stack || error}`)
    }
  }
}