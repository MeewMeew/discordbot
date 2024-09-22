import type { RunnerArgs } from "../types"
import config from "../../config.json"
import { buildEmbed } from "../utils"

export const name = "invite"
export const aliases = ["inv", "inviteme"]
export const description = "Invite me to your server"
export const category = "Utility"

export const run = async ({ message }: RunnerArgs) => {
  await message.reply(buildEmbed({
    title: "Invite",
    description: `My invite link is: [click here](https://discord.com/api/oauth2/authorize?client_id=${config.botID}&permissions=3197440&scope=bot%20applications.commands)`,
    footer: {
      text: `Requested by ${message.author.globalName}`,
      iconURL: message.author.displayAvatarURL()
    },
  }))
}