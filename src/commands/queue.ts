import type { CommandArgs } from './../types';
import { RepeatMode } from 'distube';
import { buildEmbed } from '../utils';

export const name = "queue"
export const aliases = ["q"]
export const description = "Queue related commands"
export const usage = "<loop | queue>"
export const category = "Music"

export const run = async ({ message, args, client }: CommandArgs) => {
  const queue = client.distube.getQueue(message)
  if (!queue) return
  const song = queue.songs[0]
  await message.reply(buildEmbed({
    title: client.user?.globalName!,
    description: [
      `**Current:** \`${song.name || song.url}\` - \`${queue.formattedCurrentTime}\`/\`${song.stream.playFromSource ? song.formattedDuration : song.stream.song?.formattedDuration}\``,
      `**Up next**\n${queue.songs.slice(1, 10).map((song, i) => `**${i + 1}.** \`${song.name || song.url}\``).join("\n") || "None"}`
    ].join("\n"),
    fields: [
      {
        name: "Volume",
        value: `${queue.volume}%`,
        inline: true
      },
      {
        name: "Autoplay",
        value: `${queue.autoplay ? "On" : "Off"}`,
        inline: true
      },
      {
        name: "Loop",
        value: `${queue.repeatMode === RepeatMode.QUEUE ? "Queue" : queue.repeatMode === RepeatMode.SONG ? "Song" : "Off"}`,
        inline: true
      },
      {
        name: "Filters",
        value: `${queue.filters.names.join(", ") || "Off"}`,
        inline: false
      }
    ],
    footer: {
      text: `Requested by ${message.author.globalName}`,
      iconURL: message.author.displayAvatarURL()
    }
  }))
}