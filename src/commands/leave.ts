import type { CommandArgs } from "../types";
import { buildEmbeds, getVoiceChannel } from "../utils";

export const name = "leave";
export const description = "Leave the voice channel";
export const category = "Music";

export const run = async ({ message, args, client }: CommandArgs) => {
  const { meVoiceChannel, memberVoiceChannel } = getVoiceChannel(message);
  if (!memberVoiceChannel) {
    return message.reply(buildEmbeds([
      {
        title: "Error",
        color: "Red",
        description: "You need to be in a voice channel to play music!",
        footer: {
          text: `Requested by ${message.author.globalName}`,
          iconURL: message.author.displayAvatarURL()
        }
      }
    ]));
  }

  if (!meVoiceChannel) {
    return message.reply(buildEmbeds([
      {
        title: "Error",
        color: "Red",
        description: "I'm not in a voice channel!",
        footer: {
          text: `Requested by ${message.author.globalName}`,
          iconURL: message.author.displayAvatarURL()
        }
      }
    ]));
  }

  if (meVoiceChannel.id !== memberVoiceChannel.id) {
    return message.reply(buildEmbeds([
      {
        title: "Error",
        color: "Red",
        description: "I'm not in your voice channel!",
        footer: {
          text: `Requested by ${message.author.globalName}`,
          iconURL: message.author.displayAvatarURL()
        }
      }
    ]));
  }
  const queue = client.distube.getQueue(message);
  if (queue) {
    queue.stop();
  }

  client.distube.voices.leave(memberVoiceChannel);

  message.reply(buildEmbeds([
    {
      title: client.user?.globalName!,
      description: "I'm leaving the voice channel!",
      footer: {
        text: `Requested by ${message.author.globalName}`,
        iconURL: message.author.displayAvatarURL()
      }
    }
  ]));
}