import type { CommandArgs } from "../types";
import { buildEmbed } from "../utils";

export const name = "filter";
export const description = "Filter the music queue";
export const usage = "<filter>";
export const category = "Music";

export const run = async ({ message, args, client }: CommandArgs) => {
  const filters = client.distube.getQueue(args[0])!.filters;
  if (filters.has(args[0])) filters.remove(args[0]);
  else filters.add(args[0]);
  await message.reply(buildEmbed({
    title: client.user?.globalName!,
    description: `Current filter: \`${filters.names.join(", ") || "Off"}\``,
    footer: {
      text: `Requested by ${message.author.globalName}`,
      iconURL: message.author.displayAvatarURL()
    }
  }));
}