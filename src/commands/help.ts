import type { CommandArgs } from "../types";
import { EmbedBuilder, type APIEmbedField, type RestOrArray } from "discord.js";

export const name = "help";
export const aliases = ["commands", "cmds", "h"];
export const description = "List all of my commands or info about a specific command.";
export const usage = "<command-name>"
export const category = "Info"

export const run = async ({ message, args, client }: CommandArgs) => {
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
    const _categories = [...new Set(client.commands.map((command) => command.category))].forEach((category) => {
      const commands = client.commands.filter((command) => command.category === category)
      commandFields.push({
        name: category! || "No Category",
        value: commands.map((command) => `\`${command.name}\``).join(", ")
      })
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
        name: "Aliases",
        value: command.aliases?.map((alias) => `\`${alias}\``).join(", ") || "`No aliases`"
      },
      {
        name: "Description",
        value: `\`${command.description}\`` || "`No description provided`"
      },
      {
        name: "Usage",
        value: `\`${client.config.prefix}${command.name} ${command.usage || ""}\``
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