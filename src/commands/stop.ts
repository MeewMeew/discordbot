import { EmbedBuilder } from "discord.js";
import type { RunnerArgs } from "../types";

export const name = "stop";
export const description = "Stop the music";
export const run = ({ message, client }: RunnerArgs) => {
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
  queue.stop();
  message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(client.user?.globalName!)
        .setDescription("Stopped!")
    ]
  });
};