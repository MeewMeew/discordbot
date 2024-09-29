import { Colors, EmbedBuilder } from "discord.js";
import type { Message, APIEmbedField, ColorResolvable, RestOrArray } from "discord.js";
import logger from './logger';

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

export const matchMedia = (string: string) => {
  const log = logger.scope("media matcher");
  const allUrl = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.([a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/ig;
  const tiktok = /^.*https:\/\/(?:m|www|vm|vt)?\.?tiktok\.com\/((?:.*\b(?:(?:usr|v|embed|user|video|photo)\/|\?shareId=|\&item_id=)(\d+))|\w+)/ig;

  const all = allUrl.exec(string);
  const tt = tiktok.exec(string);

  if (tt) return { platform: "tiktok", id: tt[0] };
  if (all) return { platform: "multiple", id: all[0] };
  return null;
};
