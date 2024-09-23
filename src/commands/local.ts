import path from "path";

import type { CommandArgs } from "../types";
import { type GuildTextBasedChannel } from "discord.js";
import { buildEmbed, getVoiceChannel } from "../utils";

export const name = "local";
export const description = "Play music from local files";
export const usage = "<file-name>"
export const category = "Music"

export const run = async ({ message, client, args }: CommandArgs) => {
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

  const query = args.join("-");
  if (!query) {
    return message.reply(buildEmbed({
      title: "Error",
      color: "Red",
      description: "You need to provide a file name!",
      footer: {
        text: `Requested by ${message.author.globalName}`,
        iconURL: message.author.displayAvatarURL()
      }
    }));
  }
  const file = path.resolve(__dirname, path.join('..', '..', 'assets', `${query}.mp3`))
  await client.distube.play(
    memberVoiceChannel, `file://${file}`, {
    textChannel: message.channel as GuildTextBasedChannel,
    member: message.member!,
    message: message,
    metadata: {
      message: message,
      textChannel: message.channel as GuildTextBasedChannel
    }
  })
}
