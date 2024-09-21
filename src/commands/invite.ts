import type { RunnerArgs } from "../types"
import config from "../../config.json"
import { EmbedBuilder } from "discord.js"

export const name = "invite"
export const run = async ({ message }: RunnerArgs) => {
  const embed = new EmbedBuilder()
    .setColor("Random")
    .setTitle("Invite")
    .setDescription(`My invite link is: [click here](https://discord.com/api/oauth2/authorize?client_id=${config.botID}&permissions=3197440&scope=bot%20applications.commands)`)
    .setFooter({
      text: `Requested by ${message.author.globalName}`,
      iconURL: message.author.displayAvatarURL()
    })
    .setTimestamp()

  await message.reply({ embeds: [embed] })
}