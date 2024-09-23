import type { CommandArgs } from "../types";
import { buildEmbed, getVoiceChannel } from "../utils";

export const name = "join";
export const aliases = ["j"];
export const description = "Join a voice channel";
export const category = "Music";

export const run = async ({ message, args, client }: CommandArgs) => {
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

  if (meVoiceChannel && meVoiceChannel.id === memberVoiceChannel.id) {
    return message.reply(buildEmbed({
      title: "Error",
      description: "I'm already in your voice channel!",
      color: "Red",
      footer: {
        text: `Requested by ${message.author.globalName}`,
        iconURL: message.author.displayAvatarURL()
      }
    }));
  }

  await client.distube.voices.join(memberVoiceChannel);
}