import { EmbedBuilder } from "discord.js";
import type { RunnerArgs, Metadata } from "../types";

export const name = "play";
export const description = "Play a song!";
export const usage = "<song>";
export const run = async ({ message, args, client }: RunnerArgs) => {
  const vc = message.member?.voice.channel;
  if (!vc) {
    return message.reply("You need to be in a voice channel to play music!");
  }

  const query = args.join(" ");
  if (!query) {
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle("Error")
          .setDescription("You need to be in a voice channel to play music!")
      ]
    });
  }
  const wait = await message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(client.user?.globalName!)
        .setDescription(`Searching for \`${query}\``)
    ]
  });
  client.distube.play<Metadata>(
    // @ts-ignore
    vc, query, { textChannel: message.channel ?? undefined, member: message.member }
  ).then(() => {
    wait.edit({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setTitle(client.user?.globalName!)
          .setDescription(`Playing: \`${query}\``)
      ]
    });
  }).catch((error) => {
    wait.edit({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle(client.user?.globalName!)
          .setDescription(`An error encountered while playing \`${query}\`\n\`${error.message}\``)
      ]
    });
    client.log.error(`An error encountered while playing ${query}: ${error.message}`);
  })

}