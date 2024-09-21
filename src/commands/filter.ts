import { EmbedBuilder } from "discord.js";
import type { RunnerArgs } from "../types";

export const name = "filter";
export const description = "Filter the music queue";
export const usage = "<filter>";
export const run = async ({ message, args, client }: RunnerArgs) => {
  const filters = client.distube.getQueue(args[0])!.filters;
  if (filters.has(args[0])) filters.remove(args[0]);
  else filters.add(args[0]);
  await message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(client.user?.globalName!)
        .setDescription(`Current filter: \`${filters.names.join(", ") || "Off"}\``),
    ],
  });
}