import { Events } from "distube";
import { EmbedBuilder } from "discord.js";
import { DisTubeEvent, type Metadata } from '../../types';
import type { Queue, Song } from "distube";

export default class AddSongEvent extends DisTubeEvent<Events.ADD_SONG> {
  readonly name = Events.ADD_SONG;
  run(queue: Queue, song: Song<Metadata>) {
    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("Song Added")
      .setDescription(`Added \`${song.name}\` to the queue`)

    if (!song.metadata?.message) {
      queue.textChannel?.send({ embeds: [embed] });
    } else {
      song.metadata?.message?.edit({ embeds: [embed] });
    }
  }
}