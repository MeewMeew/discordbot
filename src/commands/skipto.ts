import { EmbedBuilder } from "discord.js";
import type { RunnerArgs } from "../types";

export const name = "skipto";
export const description = "Skip to the selected song";
export const run = async ({ message, args, client }: RunnerArgs) => {
  const queue = client.distube.getQueue(message);
  if (!queue) return;
  if (isNaN(parseInt(args[0])))
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle("Error")
          .setDescription("Invalid number!")
      ]
    });
  const song = await queue.jump(parseInt(args[0]) - 1);
  await message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(client.user?.globalName!)
        .setDescription(`Skipped to \`${song.name || song.url}\``)
    ]
  });
};