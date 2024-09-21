import { EmbedBuilder } from "discord.js";
import type { RunnerArgs } from "../types";

export const name = "volume";
export const description = "Change the volume of the music";
export const usage = "<volume>";
export const run = async ({ message, args, client }: RunnerArgs) => {
  const queue = client.distube.getQueue(message);
  if (!queue)
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle("Error")
          .setDescription("There is no queue in this server!")
      ]
    });
  const volume = parseInt(args[0]);
  if (isNaN(volume))
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle("Error")
          .setDescription("Invalid volume!")
      ]
    });
  queue.setVolume(volume);
  message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(client.user?.globalName!)
        .setDescription(`Volume set to ${volume}`)
    ]
  });
};