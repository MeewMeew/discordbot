import { Colors, EmbedBuilder } from "discord.js";
import type { Message, APIEmbedField, ColorResolvable, RestOrArray } from "discord.js";

export const getVoiceChannel = (message: Message) => ({
  memberVoiceChannel: message.member?.voice.channel,
  meVoiceChannel: message.guild?.members.me?.voice.channel,
});

export const buildEmbed = ({
  color = Colors.Blurple,
  title,
  description,
  fields,
  image,
  footer,
  timestamp = true,
}: {
  color?: ColorResolvable;
  title?: string;
  description?: string;
  fields?: RestOrArray<APIEmbedField>;
  image?: string;
  footer?: { text: string; iconURL: string };
  timestamp?: boolean;
}) => {
  const embed = new EmbedBuilder().setColor(color);
  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  if (fields) embed.addFields(...fields);
  if (image) embed.setImage(image);
  if (footer) embed.setFooter(footer);
  if (timestamp) embed.setTimestamp();
  return { embeds: [embed] };
};