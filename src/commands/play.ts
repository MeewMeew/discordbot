import { type GuildTextBasedChannel } from "discord.js";
import type { RunnerArgs, Metadata } from "../types";
import { buildEmbed, getVoiceChannel } from "../utils";

export const name = "play";
export const aliases = ["p"];
export const description = "Play a song!";
export const usage = "<song>";
export const category = "Music";

export const run = async ({ message, args, client }: RunnerArgs) => {
  const { meVoiceChannel, memberVoiceChannel } = getVoiceChannel(message);
  if (!memberVoiceChannel) {
    return message.reply(buildEmbed({
      title: "Error",
      color: "Red",
      description: "You need to be in a voice channel!",
      footer: {
        text: `Requested by ${message.author.globalName}`,
        iconURL: message.author.displayAvatarURL()
      }
    }));
  }

  if (meVoiceChannel && meVoiceChannel.id !== memberVoiceChannel.id) {
    return message.reply(buildEmbed({
      title: "Error",
      color: "Red",
      description: "We are not in the same voice channel!",
      footer: {
        text: `Requested by ${message.author.globalName}`,
        iconURL: message.author.displayAvatarURL()
      }
    }));
  }

  const query = args.join(" ");
  if (!query) {
    return message.reply(buildEmbed({
      title: "Error",
      color: "Red",
      description: "You need to provide a song name!",
      footer: {
        text: `Requested by ${message.author.globalName}`,
        iconURL: message.author.displayAvatarURL()
      }
    }));
  }
  const searching = await message.reply(buildEmbed({
    title: client.user?.globalName!,
    description: `Searching for \`${query}\``,
    footer: {
      text: `Requested by ${message.author.globalName}`,
      iconURL: message.author.displayAvatarURL()
    }
  }));
  await client.distube.play<Metadata>(
    memberVoiceChannel, query, {
    textChannel: message.channel as GuildTextBasedChannel,
    member: message.member!,
    message: message,
    metadata: {
      message: message,
      textChannel: message.channel as GuildTextBasedChannel
    }
  }).then(() => searching.delete());
}