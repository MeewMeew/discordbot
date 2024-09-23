import type { CommandArgs } from "../types";
import { buildEmbed } from "../utils";

export const name = "volume";
export const aliases = ["v"];
export const description = "Change the volume of the music";
export const usage = "<volume>";
export const category = "Music";

export const run = async ({ message, args, client }: CommandArgs) => {
  const queue = client.distube.getQueue(message);
  if (!queue) {
    return message.reply(buildEmbed({
      title: "Error",
      description: "There is no queue in this server!",
      color: "Red",
      footer: {
        text: `Requested by ${message.author.globalName}`,
        iconURL: message.author.displayAvatarURL()
      }
    }));
  }
  const volume = parseInt(args[0]);
  if (isNaN(volume)) {
    return message.reply(buildEmbed({
      title: "Error",
      description: "Invalid volume!",
      color: "Red",
      footer: {
        text: `Requested by ${message.author.globalName}`,
        iconURL: message.author.displayAvatarURL()
      }
    }));
  }
  await queue.setVolume(volume);
  await message.reply(buildEmbed({
    title: client.user?.globalName!,
    description: `Volume set to ${volume}`,
    footer: {
      text: `Requested by ${message.author.globalName}`,
      iconURL: message.author.displayAvatarURL()
    }
  }));
};