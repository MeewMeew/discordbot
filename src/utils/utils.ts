import { Signale } from 'signale';
import { Colors, EmbedBuilder, type APIEmbedField, type ColorResolvable, type Message, type RestOrArray } from "discord.js";
import config from "../../config.json";

export function getVoiceChannel(message: Message) {
  return {
    memberVoiceChannel: message.member?.voice.channel,
    meVoiceChannel: message.guild?.members.me?.voice.channel
  }
}

export function buildEmbed({
  color = Colors.Blurple,
  title,
  description,
  fields,
  image,
  footer,
  timestamp = true
}: {
  color?: ColorResolvable,
  title: string,
  description: string,
  fields?: RestOrArray<APIEmbedField>
  image?: string,
  footer?: {
    text: string,
    iconURL: string
  },
  timestamp?: boolean
}) {
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
  if (fields) {
    embed.addFields(...fields)
  }
  if (image) {
    embed.setImage(image)
  }
  if (footer) {
    embed.setFooter(footer)
  }
  if (timestamp) {
    embed.setTimestamp()
  }

  return {
    embeds: [embed]
  }
}

export function matchMedia(string: string) {
  const log = new Signale({ scope: "media matcher" })

  const allUrl = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.([a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/ig
  const tiktok = /^.*https:\/\/(?:m|www|vm|vt)?\.?tiktok\.com\/((?:.*\b(?:(?:usr|v|embed|user|video|photo)\/|\?shareId=|\&item_id=)(\d+))|\w+)/ig

  const all = allUrl.exec(string)
  const tt = tiktok.exec(string)

  if (tt) {
    return {
      platform: "tiktok",
      id: tt[0],
    }
  } else if (all) {
    return {
      platform: "multiple",
      id: all![0],
    }
  }
  return null
}
