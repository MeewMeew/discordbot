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

  const facebook = /(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/ig
  const tiktok = /^.*https:\/\/(?:m|www|vm|vt)?\.?tiktok\.com\/((?:.*\b(?:(?:usr|v|embed|user|video|photo)\/|\?shareId=|\&item_id=)(\d+))|\w+)/ig

  const fb = facebook.exec(string)
  const tt = tiktok.exec(string)

  if (fb) {
    const type = fb[0].includes("share/r") ? "reel" : fb[0].includes("share/v") ? "video" : fb[0].includes("share/p") ? "picture" : null
    return {
      platform: "facebook",
      id: fb[0],
      type: type
    }
  } else if (tt) {
    return {
      platform: "tiktok",
      id: tt[0],
      type: 'unknown'
    }
  } else {
    return null
  }
}