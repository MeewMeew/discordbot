import type { RunnerArgs } from "../types";
import { buildEmbed } from "../utils";

export const name = "skipto";
export const description = "Skip to the selected song";
export const usage = "<number>";
export const category = "Music";

export const run = async ({ message, args, client }: RunnerArgs) => {
  const queue = client.distube.getQueue(message);
  if (!queue) return;
  if (isNaN(parseInt(args[0]))) {
    return message.reply(buildEmbed({
      title: "Error",
      description: "Invalid number!",
      color: "Red",
      footer: {
        text: `Requested by ${message.author.globalName}`,
        iconURL: message.author.displayAvatarURL()
      }
    }));
  }
  const song = await queue.jump(parseInt(args[0]) - 1);
  await message.reply(buildEmbed({
    title: client.user?.globalName!,
    description: `Skipped to \`${song.name || song.url}\``,
    footer: {
      text: `Requested by ${message.author.globalName}`,
      iconURL: message.author.displayAvatarURL()
    }
  }));
};