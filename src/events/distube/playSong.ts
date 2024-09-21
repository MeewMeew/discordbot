import { EmbedBuilder } from "discord.js";
import { Events, Queue, Song } from "distube";
import { DisTubeEvent, type Metadata } from "../../types";

export default class PlaySongEvent extends DisTubeEvent<Events.PLAY_SONG> {
  readonly name = Events.PLAY_SONG;
  run(queue: Queue, song: Song<Metadata>) {
    const emded = new EmbedBuilder().setColor("Blurple").setTitle(song.user?.globalName!).setDescription(`Playing: \`${song.name}\``)
    if (!song.metadata?.message) {
      queue.textChannel?.send({ embeds: [emded] });
    } else {
      song.metadata?.message?.edit({ embeds: [emded] });
    }
  }
}