import type { CommandArgs } from "../types"
import { buildEmbeds } from "../utils"

export const name = "invite"
export const aliases = ["inv", "inviteme"]
export const description = "Invite me to your server"
export const category = "Utility"

export const run = async ({ message, client }: CommandArgs) => {
  await message.reply(buildEmbeds([
    {
      title: "Invite",
      description: `My invite link is: [click here](https://discord.com/api/oauth2/authorize?client_id=${client.config.botID}&permissions=3197440&scope=bot%20applications.commands)`,
      footer: {
        text: `Requested by ${message.author.globalName}`,
        iconURL: message.author.displayAvatarURL()
      },
    }
  ]))
}