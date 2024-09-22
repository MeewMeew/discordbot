import { Colors, EmbedBuilder, type APIEmbedField, type ColorResolvable, type Message, type RestOrArray } from "discord.js";

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
  footer,
  timestamp = true
}: {
  color?: ColorResolvable,
  title: string,
  description: string,
  fields?: RestOrArray<APIEmbedField>
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