import type { Command, RunnerArgs } from "../types";
import config from "../../config.json";
import { EmbedBuilder, type APIEmbedField, type RestOrArray } from "discord.js";

export const name = "help";
export const description = "List all of my commands or info about a specific command.";
export const run = async ({ message, args, client }: RunnerArgs) => {
  const embed = new EmbedBuilder()
    .setColor("Random")
    .setThumbnail(client.user!.displayAvatarURL())
    .setTimestamp()
    .setFooter({
      text: `Requested by ${message.author.globalName}`,
      iconURL: message.author.displayAvatarURL()
    })

  if (!args.length) {
    const commandFields: RestOrArray<APIEmbedField> = []
    client.commands.forEach((command) => {
      if (command.name) {
        commandFields.push({
          name: command.name,
          value: command.description || "No description provided"
        })
      }
    })
    embed.setTitle("Here's a list of all my commands:")
    embed.setFields(commandFields)
  } else {
    const name = args[0].toLowerCase()
    embed.setTitle(`Command: \`${name}\``)
    const command = client.commands.get(name)
    if (!command) {
      return message.reply({ content: "That's not a valid command!" })
    }
    const commandFields: RestOrArray<APIEmbedField> = [
      {
        name: "Description",
        value: `\`${command.description}\`` || "`No description provided`"
      },
      {
        name: "Usage",
        value: `\`${config.prefix}${command.name} ${command.usage || ""}\``
      },
      {
        name: "Cooldown",
        value: `\`${command.timeout || 3} second(s)\``
      }
    ]
    embed.setFields(commandFields)
  }

  await message.reply({ embeds: [embed] })
}