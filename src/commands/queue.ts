import { EmbedBuilder } from 'discord.js';
import type { RunnerArgs } from './../types';
import { RepeatMode } from 'distube';
export const name = "queue"
export const description = "Queue related commands"
export const usage = "<loop | queue>"
export const run = async ({ message, args, client }: RunnerArgs) => {
  const queue = client.distube.getQueue(message)
  if (!queue) return
  const song = queue.songs[0]
  await message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(client.user?.globalName!)
        .setDescription(
          [
            `**Current:** \`${song.name || song.url}\` - \`${queue.formattedCurrentTime}\`/\`${song.stream.playFromSource ? song.formattedDuration : song.stream.song?.formattedDuration
            }\`\n`,
            `**Up next**\n${queue.songs
              .slice(1, 10)
              .map((song, i) => `**${i + 1}.** \`${song.name || song.url}\``)
              .join("\n") || "None"
            }`,
          ].join("\n"),
        )
        .addFields(
          {
            name: "Volume",
            value: `${queue.volume}%`,
            inline: true,
          },
          {
            name: "Autoplay",
            value: `${queue.autoplay ? "On" : "Off"}`,
            inline: true,
          },
          {
            name: "Loop",
            value: `${queue.repeatMode === RepeatMode.QUEUE ? "Queue" : queue.repeatMode === RepeatMode.SONG ? "Song" : "Off"
              }`,
            inline: true,
          },
          {
            name: "Filters",
            value: `${queue.filters.names.join(", ") || "Off"}`,
            inline: false,
          },
        ),
    ]
  })
}