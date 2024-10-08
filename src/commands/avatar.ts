import type { CommandArgs } from "../types"
import { buildEmbeds } from "../utils"

export const name = 'avatar'
export const aliases = ['av']
export const description = 'Get the avatar of a user | Set bot avatar'
export const category = 'Utility'

export const run = async ({ message, args, client }: CommandArgs) => {
  const user = message.mentions.users.first() || message.author
  const member = message.guild?.members.cache.get(user.id)
  const avatar = user.displayAvatarURL({ size: 4096 })

  if (args[0] === 'set') {
    if (member?.id !== client.config.ownerID) {
      return message.reply(buildEmbeds([
        {
          title: 'Error',
          description: 'You do not have the required permissions to set the bot avatar',
          color: 'Red',
          footer: {
            text: `Requested by ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL()
          }
        }
      ]))
    }

    const url = args[1]
    if (!url) {
      return message.reply(buildEmbeds([
        {
          title: 'Error',
          description: 'You need to provide a valid image URL',
          color: 'Red',
          footer: {
            text: `Requested by ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL()
          }
        }
      ]))
    }

    await client.user?.setAvatar(url)
    return message.reply(buildEmbeds([
      {
        title: client.user?.username!,
        description: 'Avatar set successfully',
        image: url,
        footer: {
          text: `Requested by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL()
        }
      }
    ]))
  }

  return message.reply(buildEmbeds([
    {
      title: user.username,
      description: `[Avatar URL](${avatar})`,
      image: avatar,
      footer: {
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL()
      }
    }
  ]))
}