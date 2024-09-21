import path from "path";
import { existsSync } from "fs";

import type { RunnerArgs } from "../types";
import { EmbedBuilder } from "discord.js";

export const name = "local";
export const description = "Play music from local files";
export const usage = "<file-name>"
export const run = async ({ message, client, args }: RunnerArgs) => {
  const vc = message.member?.voice.channel;
  if (!vc) {
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle("Error")
          .setDescription("You need to be in a voice channel to play music!")
      ]
    });
  }
  const query = args.join("-");
  if (!query) {
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle("Error")
          .setDescription("You need to provide a file name!")
      ]
    });
  }
  const file = path.resolve(__dirname, path.join('..', '..', 'assets', `${query}.mp3`))
  // @ts-ignore
  await client.distube.play(vc, `file://${file}`, { textChannel: message.channel ?? undefined, member: message.member })
}
